const br = () => console.log("-------------------");

// Récupération des scores d'un joueur
function getValues(obj: Record<string, unknown>) {
   return Object.values(obj);
}

const scores = {
   level1: 100,
   level2: 85,
   level3: 95
};
console.log(getValues(scores)); br() // [100, 85, 95]







// Conversion de prix euros en dollars
function transformValues(obj: Record<string, number>, transformer: (value: number) => number) {
   return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, transformer(value)])
   );
}

const pricesInEuros = {
   book: 20,
   pen: 5,
   notebook: 10
};
const toDollars = (euros: number) => euros * 1.1;

console.log(transformValues(pricesInEuros, toDollars)); br() // { book: 22, pen: 5.5, notebook: 11 }







// Fusion des ventes mensuelles magasins
function mergeObjects(obj1: Record<string, number>, obj2: Record<string, number>) {
   const result: Record<string, number> = {};

   for (const key in obj1) {
      result[key] = obj1[key] + (obj2[key] ?? 0);
   }

   return result;
}

const store1Sales = { january: 1000, february: 1200, march: 900 };
const store2Sales = { january: 800, february: 950, march: 1100 };

console.log(mergeObjects(store1Sales, store2Sales)); br() // { january: 1800, february: 2150, march: 2000 }







// Filtrage des produits en rupture
function filterObject(obj: Record<string, number>, predicate: (value: number) => boolean) {
   return Object.fromEntries(
      Object.entries(obj).filter(([, value]) => predicate(value))
   );
}

const inventory = {
   laptop: 0,
   smartphone: 5,
   tablet: 0,
   headphones: 8
};

console.log(filterObject(inventory, stock => stock === 0)); br() // { laptop: 0, tablet: 0 }

