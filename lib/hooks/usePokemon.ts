import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { pokemonApi } from '../api/pokemon';

export const usePokemonList = (limit = 20) => {
  return useInfiniteQuery({
    queryKey: ['pokemons', limit],
    queryFn: ({ pageParam = 0 }) => pokemonApi.getPokemons(limit, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.next) return undefined;
      return allPages.length * limit;
    },
    initialPageParam: 0,
  });
};

export const usePokemonDetail = (nameOrId: string | number) => {
  return useQuery({
    queryKey: ['pokemon', nameOrId],
    queryFn: () => pokemonApi.getPokemonDetail(nameOrId),
    enabled: !!nameOrId,
  });
};

export const useSearchPokemon = (query: string) => {
  return useQuery({
    queryKey: ['searchPokemon', query],
    queryFn: () => pokemonApi.searchPokemon(query),
    enabled: query.length > 0,
    retry: false,
  });
};