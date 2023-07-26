import {Component, OnDestroy, OnInit} from '@angular/core';
import {FINANCES} from "../../core/constants/router.constants";
import {HttpService} from "../../core/services/http.service";
import {SubscriptionDto} from "../../core/dto/subscription.dto";
import {NavigationEnd, Router} from "@angular/router";
import {CategoryDto} from "../../core/dto/category.dto";
import {CategoryTotalDto} from "../../core/dto/CategoryTotal.dto";
import {SubscriptionTotalDto} from "../../core/dto/subscriptionTotal.dto";
import * as moment from "moment";
import {TranslateService} from "@ngx-translate/core";
import {lastValueFrom} from "rxjs";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import {Capacitor} from "@capacitor/core";
import {Device} from "@capacitor/device";
import {CurrencyEnum} from "../../core/enum/currency.enum";

@Component({
  selector: 'app-tab2',
  templateUrl: 'finance.component.html',
  styleUrls: ['finance.component.scss']
})
export class Finance implements OnInit,OnDestroy{
  FINANCES: string= FINANCES;
  subscriptions: SubscriptionDto[];
  total:number=0;
  categories:CategoryDto[]=[];

  public years= [
    2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,
    2017,2018,2019,2020,2021,2022,2023
  ]

  public months=[{
    value:1,
    name:'January'
  },
    {
      value:2,
      name:'February'
    },
    {
      value:3,
      name:'March'
    },
    {
      value:4,
      name:'April'
    },
    {
      value:5,
      name:'May'
    },
    {
      value:6,
      name:'June'
    },
    {
      value:7,
      name:'July'
    },
    {
      value:8,
      name:'August'
    },
    {
      value:9,
      name:'September'
    },
    {
      value:10,
      name:'October'
    },{
      value:11,
      name:'November'
    },{
      value:12,
      name:'December'
    },
    {
      value:0,
      name:'whole Year'
    }]

  public selectedYear:number=moment().get('year')
  public selectedMonth:number=moment().get('month')+1
  allTimeExpenses: number;
  subsOrCategory: string='subscription';
  public categoryTotal: CategoryTotalDto[]=[];
  public subsTotal: SubscriptionTotalDto[]=[];
  public currency: CurrencyEnum=CurrencyEnum.EURO;

  constructor(private httpService:HttpService,private router:Router, private translateService:TranslateService) {}

  async ngOnInit() {
    await this.init()
    this.router.events.subscribe(async (event) => {
      if (event instanceof NavigationEnd && event.url===FINANCES) {
        await this.init()
      }
    });
  }

  async init(){
    const fp =(await FingerprintJS.load()).get()
    let deviceId=Capacitor.getPlatform()==='web'? 'web' :(await Device.getId()).identifier
    this.currency=(await this.httpService.getSettingsForDeviceAndUser(deviceId)).currency
    this.total=0;
    await this.subFunctions()
    await this.setMonths()
    this.selectedMonth=moment().get('month')+1
  }

  async subFunctions(){
    await this.getTotalSubscriptionExpenses()
    this.allTimeExpenses= await this.httpService.getAllTimeExpenses()
  }

  async setMonths(){
    this.months[0].name=await lastValueFrom(this.translateService.get('months.january'))
    this.months[1].name=await lastValueFrom(this.translateService.get('months.february'))
    this.months[2].name=await lastValueFrom(this.translateService.get('months.march'))
    this.months[3].name=await lastValueFrom(this.translateService.get('months.april'))
    this.months[4].name=await lastValueFrom(this.translateService.get('months.may'))
    this.months[5].name=await lastValueFrom(this.translateService.get('months.june'))
    this.months[6].name=await lastValueFrom(this.translateService.get('months.july'))
    this.months[7].name=await lastValueFrom(this.translateService.get('months.august'))
    this.months[8].name=await lastValueFrom(this.translateService.get('months.september'))
    this.months[9].name=await lastValueFrom(this.translateService.get('months.october'))
    this.months[10].name=await lastValueFrom(this.translateService.get('months.november'))
    this.months[11].name=await lastValueFrom(this.translateService.get('months.december'))
    this.months[12].name=await lastValueFrom(this.translateService.get('months.wholeYear'))
  }


  async getTotalSubscriptionExpenses(){
    if (this.selectedMonth > 0) {
      this.subsTotal = await this.httpService.getTotalSubscriptionExpenses(moment(this.selectedYear + '/' + this.selectedMonth+'/1').format('YYYY/MM/DD'), moment(new Date(this.selectedYear,this.selectedMonth,0)).format('YYYY/MM/DD'))
    } else {
      this.subsTotal = await this.httpService.getTotalSubscriptionExpenses(this.selectedYear.toString(), (this.selectedYear + 1).toString())
    }
      this.subsTotal.sort((a,b)=>b.price-a.price)
     this.subsTotal.forEach(subTotal=> this.total +=Number(subTotal.price));
  }

  async typeChange(){
    this.categoryTotal=[];
    this.total=0;
    await this.subFunctions();
    if(this.subsOrCategory==='category') {
      this.categories = await this.httpService.getCategories()
      await this.calculateTotalPerCategory()
    }
  }

  displayMonths(month:number) {
    return !(this.selectedYear === new Date().getFullYear() && month > new Date().getMonth() + 1);
  }

  async calculateTotalPerCategory() {
    if (this.selectedMonth > 0) {
      this.categoryTotal = await this.httpService.getCategoriesTotals(this.selectedYear + '/' + this.selectedMonth+'/1', moment(new Date(this.selectedYear,this.selectedMonth,0)).format('YYYY/MM/DD'))
    } else {
      this.categoryTotal = await this.httpService.getCategoriesTotals(this.selectedYear.toString(), (this.selectedYear + 1).toString())
    }
    this.categoryTotal.sort((a,b)=>b.total-a.total)
  }

  ngOnDestroy() {
  }
}
