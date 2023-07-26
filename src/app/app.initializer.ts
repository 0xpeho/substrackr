import { FenceCalculatorStoreService } from './core/services/fence-calculator-store.service';
import { HttpService } from './core/services/http.service';
import { UrlParamExtractionService } from './core/services/urlParamExtraction.service';

export function initializeAppFactory(
  urlExtraction: UrlParamExtractionService,
  httpService: HttpService,
  fenceCalculatorStore: FenceCalculatorStoreService
): () => Promise<void> {
  return () =>
    new Promise<void>(async resolve => {
      await applyDesign(urlExtraction.getCustomerIdentifier(), httpService);
      await loadPossibilities(
        urlExtraction.getCustomerIdentifier(),
        httpService,
        fenceCalculatorStore
      );
      resolve();
    });
}

async function applyDesign(customer: string, httpService: HttpService) {
  const design = await httpService.getDesign(customer);
  if (design) {
    document.documentElement.style.setProperty(
      '--primary',
      design.primaryColor
    );
    document.documentElement.style.setProperty(
      '--secondary',
      design.secondaryColor
    );
    document.documentElement.style.setProperty(
      '--tertiary',
      design.tertiaryColor
    );
  }
}

async function loadPossibilities(
  customer: string,
  httpService: HttpService,
  fenceCalculatorStore: FenceCalculatorStoreService
) {
  const fenceDevicePossibilities =
    await httpService.getFenceDevicePossibilities(customer);
  const fenceConfiguationPossibilities =
    await httpService.getFenceConfigurationPossibilities(customer);
  const cornerConfigurationPossibilities =
    await httpService.getCornerConfigurationPossibilities(customer);
  const gateConfigurationPossibilities =
    await httpService.getGateConfigurationPossibilities(customer);
  const scopes = await httpService.getScopes();
  const options = await httpService.getOptions();
  let generalAddOns = await httpService.getGeneralAddOns(customer);

  const parentTraitsDevice = await httpService.getParentTraitsForParentType(
    'fenceDevice'
  );
  const parentTraitsConductor = await httpService.getParentTraitsForParentType(
    'conductor'
  );
  const parentTraitsIsolator = await httpService.getParentTraitsForParentType(
    'isolator'
  );
  const parentTraitsPole = await httpService.getParentTraitsForParentType(
    'pole'
  );

  let animals = fenceDevicePossibilities
    .map(item => ({
      nameKey: item.animalNameKey,
      imageUri: item.animalImageUri,
    }))
    .filter(
      (animal, index, self) =>
        self.findIndex(value => value.nameKey === animal.nameKey) === index
    );

  const animals2 = fenceConfiguationPossibilities
    .map(item => ({
      nameKey: item.animalNameKey,
      imageUri: item.animalImageUri,
    }))
    .filter(
      (animal, index, self) =>
        self.findIndex(value => value.nameKey === animal.nameKey) === index
    );

  animals = [...animals, ...animals2];
  animals = animals.filter(
    (animal, index, self) =>
      self.findIndex(value => value.nameKey === animal.nameKey) === index
  );

  animals = animals.sort((a, b) => a.nameKey.localeCompare(b.nameKey));

  generalAddOns = generalAddOns.filter(
    addOn => addOn.addOnTypeNameKey === 'generalAddOn'
  );

  fenceCalculatorStore.updateFenceDevicePossibilities(fenceDevicePossibilities);
  fenceCalculatorStore.updateFenceConfigurationPossibilities(
    fenceConfiguationPossibilities
  );
  fenceCalculatorStore.updateCornerConfigurationPossibilities(
    cornerConfigurationPossibilities
  );
  fenceCalculatorStore.updateGateConfigurationPossibilites(
    gateConfigurationPossibilities
  );
  fenceCalculatorStore.updateAvailableAnimals(animals);
  fenceCalculatorStore.updateAvailableScopes(scopes);
  fenceCalculatorStore.updateRowCounts(options.rowCounts);
  fenceCalculatorStore.updateFenceCategories(options.fenceCategories);
  fenceCalculatorStore.updateIsolatorCategories(options.isolatorCategories);
  fenceCalculatorStore.updateIsolatorCategoriesCorner(
    options.isolatorCategories
  );
  fenceCalculatorStore.updateIsolatorCategoriesGate(options.isolatorCategories);
  fenceCalculatorStore.updateDeviceFilterTraits(parentTraitsDevice);
  fenceCalculatorStore.updateConductorFilterTraits(parentTraitsConductor);
  fenceCalculatorStore.updateIsolatorFilterTraits(parentTraitsIsolator);
  fenceCalculatorStore.updatePoleFilterTraits(parentTraitsPole);
  fenceCalculatorStore.updateGeneralAddOns(generalAddOns);
}
