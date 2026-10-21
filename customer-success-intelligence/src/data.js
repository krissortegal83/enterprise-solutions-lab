/**
 * Fictional organizations and simulated metrics. Nothing here represents
 * Sitetracker customers, subscriptions, contracts, or proprietary data.
 * Order of columns: name, segment, region, annual contract value (USD),
 * days to renewal, adoption, value realization, relationship depth,
 * open priority tickets, days since touch, executive sponsor, language.
 */
const rows = [
  ['Aster Grid Energy','Utilities','United States',188000,42,46,54,48,2,27,'VP, Grid Operations','en'],
  ['SierraWave Networks','Telecom','Mexico',154000,71,62,72,76,1,11,'Director de Operaciones','es'],
  ['Northpoint Fiber','Telecom','Canada',214000,137,88,85,91,0,8,'SVP, Network Delivery','en'],
  ['Luma Corridor Group','Construction','United States',98000,23,38,41,39,3,34,'Program Director','en'],
  ['Altavia Renewables','Renewables','Mexico',136000,116,81,79,87,0,10,'Gerente de Proyectos','es'],
  ['Westbridge Infrastructure','Construction','United States',124000,205,77,68,75,1,14,'Director, PMO','en'],
  ['Arbor Peak Power','Utilities','Canada',168000,59,51,48,52,2,26,'Head of Field Delivery','en'],
  ['Vía Nexo Telecom','Telecom','Mexico',79000,89,69,66,71,0,18,'Director de Red','es'],
  ['HelioWorks Solar','Renewables','United States',111000,263,91,88,95,0,6,'VP, EPC','en'],
  ['Aldara Site Services','Field Services','Mexico',58000,32,43,45,47,2,35,'Gerente General','es'],
  ['Clearpath Facilities','Field Services','United States',89000,179,80,73,83,0,13,'COO','en'],
  ['Atlas Shore Utilities','Utilities','Canada',172000,74,61,58,59,1,21,'Director, Operations','en'],
  ['Red Cumbre Wireless','Telecom','Mexico',104000,312,76,82,86,0,8,'VP de Ingeniería','es'],
  ['Pioneer Corridor','Construction','United States',147000,93,58,62,64,1,23,'VP, Delivery','en'],
  ['Evercrest Energy','Renewables','Canada',199000,144,87,89,92,0,5,'Head of Energy Assets','en'],
  ['Cordillera Fiber','Telecom','Mexico',67000,52,47,53,56,1,29,'Jefe de Despliegue','es'],
  ['Horizon Public Works','Utilities','United States',131000,228,73,80,82,0,14,'Director, Capital Projects','en'],
  ['Meridian Tower Group','Telecom','United States',156000,36,54,56,45,2,25,'Director, Network Build','en'],
  ['Travesía Ingeniería','Construction','Mexico',72000,198,83,79,90,0,9,'Director de Proyectos','es'],
  ['Canyon Link Systems','Telecom','United States',117000,285,86,82,87,0,7,'VP, Operations','en'],
  ['Polar Bay Infrastructure','Construction','Canada',97000,104,64,61,65,1,22,'Head of PMO','en'],
  ['Solaris Field Group','Renewables','Mexico',128000,67,55,59,56,1,27,'Líder de Implementación','es'],
  ['NovaLine Utilities','Utilities','United States',182000,256,90,92,94,0,4,'VP, Infrastructure','en'],
  ['Páramo Telecom','Telecom','Mexico',54000,18,33,38,40,3,41,'Director General','es'],
  ['Forge Ridge Constructors','Construction','United States',93000,85,67,64,69,0,16,'Construction Director','en'],
  ['Northwind Electrical','Field Services','Canada',84000,221,82,77,79,0,12,'Service Delivery Lead','en'],
  ['EcoTrama Energía','Renewables','Mexico',143000,162,79,84,85,0,11,'Directora de Operaciones','es'],
  ['BluePeak Towers','Telecom','United States',207000,114,60,67,62,1,20,'Chief Network Officer','en'],
  ['Valterra BuildCo','Construction','Mexico',69000,47,49,44,42,2,31,'Gerente de Construcción','es'],
  ['SummitLine Rail','Construction','Canada',163000,341,85,77,88,0,9,'Director, Programs','en'],
  ['Vector Grid Partners','Utilities','United States',175000,92,74,71,72,0,16,'VP, Operations','en'],
  ['Orion Siteworks','Field Services','Mexico',63000,193,88,84,90,0,8,'Gerente de Servicio','es'],
  ['Coastal Utility Group','Utilities','Canada',120000,63,59,53,57,1,24,'Director, Asset Management','en'],
  ['Pacific Wave Towers','Telecom','United States',148000,278,93,90,94,0,5,'VP, Network Engineering','en'],
  ['Senda Verde Infra','Renewables','Mexico',105000,125,72,74,79,0,15,'Director de Energía','es']
];

export function datePlusDays(day, count) {
  const date = new Date(`${day}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + count);
  return date.toISOString().slice(0, 10);
}

export function todayLocal() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function makeSeedAccounts(today = todayLocal()) {
  return rows.map((r, i) => ({
    id: `ACC-${String(i + 1).padStart(3, '0')}`,
    name: r[0], segment: r[1], region: r[2], arr: r[3],
    renewal: datePlusDays(today, r[4]), adoption: r[5], value: r[6],
    sponsor: r[7], p1: r[8], lastTouch: datePlusDays(today, -r[9]),
    sponsorTitle: r[10], language: r[11],
    owner: ['Christian O.','Customer Team A','Customer Team B'][i % 3],
    notes: '', activities: [],
    objectives: r[1] === 'Telecom' ? 'Improve deployment predictability and site visibility'
      : r[1] === 'Utilities' ? 'Improve asset visibility and milestone governance'
      : r[1] === 'Renewables' ? 'Accelerate rollout and time-to-value'
      : r[1] === 'Construction' ? 'Increase project transparency and on-time delivery'
      : 'Standardize field execution and stakeholder reporting'
  }));
}
