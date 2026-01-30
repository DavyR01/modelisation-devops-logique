
const br = () => console.log("-------------------");

// Longueur message sans espaces
function lengthWithoutSpaces(input: string): number {
   return input.split(" ").join("").length;
}

console.log(lengthWithoutSpaces("Bonjour le monde !")); br(); // 15 et non 16 comme l'énoncé




// Salutation prénom avec majuscule
function greetFirstName(firstName: string): string {
   return (
      "Bonjour " +
      firstName
         .split("-")
         .map(part => part.charAt(0).toUpperCase() + part.slice(1))
         .join("-")
   );
}

console.log(greetFirstName("jean-pierre")); br(); // "Bonjour Jean-Pierre"






// Détection point exclamation en fin
function endsWithExclamation(text: string): boolean {
   return text.endsWith("!");
}

console.log(endsWithExclamation("Je suis très satisfait !")); br(); // true






// Inversion ordre des mots phrase
function reverseWords1(sentence: string): string {
   return sentence.split(" ").reverse().join(" ");
}

const frenchPhrase = "Je mange une pomme";
console.log(reverseWords1(frenchPhrase)); br(); // "pomme une mange Je"





// Comptage occurrences lettre dans texte
function countLetterOccurrences(text: string, letter: string): number {
   return text.split(letter).length - 1;
}

console.log(countLetterOccurrences("programmation", "m")); br(); // 2





// Conversion nom vers format JavaScript
function toCamelCase(value: string): string {
   return value
      .split("_")
      .map((part, index) =>
         index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
      )
      .join("");
}

console.log(toCamelCase("user_first_name")); br(); // "userFirstName"





// Analyse voyelles pour sonorité poétique
function countVowels(text: string): number {
   const vowels = ["a", "e", "i", "o", "u", "y"];

   return text
      .toLowerCase()
      .split("")
      .filter(char => vowels.includes(char))
      .length;
}

console.log(countVowels("un ver au hasard !")); br(); // 6






// Alternance visuelle pour mots mémorisables
function alternateCase(text: string): string {
   return text
      .split("")
      .map((char, index) =>
         index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
      )
      .join("");
}

console.log(alternateCase("password")); br(); // "pAsSwOrD"







// Nettoyage répétitions caractères utilisateurs
function removeDuplicates(text: string): string {
   return text
      .split("")
      .filter((char, index, array) => char !== array[index - 1])
      .join("");
}

const messageUtilisateur = "Bonjouuuur !!! J'ai besoiiiin d'aide....";
console.log(removeDuplicates(messageUtilisateur)); br(); // "Bonjour ! J'ai besoin d'aide."





// Génération initiales identifiant employé
function getInitials(fullName: string): string {
   return fullName
      .split(" ")
      .filter(word => word.length > 0)
      .map(word => word[0].toUpperCase())
      .join("");
}

console.log(getInitials("Jean Pierre Dupont")); br(); // "JPD"









// Masquage affichage données sensibles
function maskString(value: string, visibleCount: number): string {
   return value.slice(-visibleCount);
}

const cardNumber = "1234567890123456";
console.log(maskString(cardNumber, 4)); br(); // "3456"
