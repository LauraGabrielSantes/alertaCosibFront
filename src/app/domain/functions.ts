import Fuse from 'fuse.js';
import { Lugares } from './tipo-alerta';

// Function to get location suggestions based on input using Fuse.js
export async function getLuagares(inputWord: string, n: number) {
  // Ensure n is a positive number
  if (n <= 0 || typeof n !== 'number') {
    return [];
  }

  // Convert input word to lowercase for case-insensitive matching
  const lowerCaseInput = inputWord.toLowerCase();

  // Create an instance of Fuse.js
  const fuse = new Fuse(Lugares, {
    includeScore: true, // Include score in the results
    threshold: 0.3, // Set the threshold for fuzzy matching (lower is stricter)
    keys: ['name'], // Specify the keys to search for
  });

  // Perform the search using Fuse.js
  const results = fuse.search(lowerCaseInput);

  // Map the results to return only the matched words
  const matchedLocations = results
    .slice(0, n) // Limit results to n
    .map((result) => result.item); // Extract the matched item

  return matchedLocations;
}
