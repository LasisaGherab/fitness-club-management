import { useState, useEffect } from 'react';

// "T" est un type générique : ce Hook peut fonctionner avec N'IMPORTE QUEL type
// de données (Member[], Coach[], etc.), tout en restant totalement typé à l'usage.
// C'est l'équivalent, pour une fonction, de ce qu'est <TabId> pour useState.
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  // La fonction d'initialisation de useState n'est exécutée qu'UNE SEULE FOIS,
  // au tout premier rendu (et non à chaque re-render). C'est l'endroit idéal
  // pour lire le localStorage de façon sécurisée.
  const [value, setValue] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(key);
      // Si aucune donnée n'existe encore pour cette clé, on utilise la valeur
      // initiale fournie par le composant appelant (nos Mock Data, par exemple).
      if (storedValue === null) {
        return initialValue;
      }
      // "as T" : on affirme que le JSON parsé correspond au type attendu.
      // C'est une limite connue de JSON.parse (qui retourne "any" en natif) :
      // on encapsule ce risque UNE SEULE FOIS, ici, dans ce Hook générique,
      // plutôt que de laisser des "any" se propager dans toute l'application.
      return JSON.parse(storedValue) as T;
    } catch (error) {
      // Si le JSON stocké est corrompu ou invalide, on retombe sur la valeur
      // initiale plutôt que de faire planter toute l'application.
      console.error(`Erreur de lecture du localStorage pour la clé "${key}" :`, error);
      return initialValue;
    }
  });

  // Cet effet se redéclenche à chaque fois que "value" change, et réécrit
  // alors la nouvelle valeur dans le localStorage, sous forme de texte JSON.
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Erreur d'écriture du localStorage pour la clé "${key}" :`, error);
    }
  }, [key, value]);

  // On retourne exactement la même forme qu'un useState classique :
  // [valeurActuelle, fonctionDeMiseAJour], ce qui rend ce Hook totalement
  // interchangeable avec un useState<T> dans le reste de notre code.
  return [value, setValue];
}

export default useLocalStorage;