
// Longueur message sans espaces
function lengthWithoutSpaces(input: string): number {
  return input.split(" ").join("").length;
}

console.log(lengthWithoutSpaces("Bonjour le monde !")); // 15 et non 16 comme l'énoncé


