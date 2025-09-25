import { apiClient } from "./apiClient";

export interface Pokemon {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: {
    front_default: string;
    back_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  abilities: Array<{
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
  }>;
  types: Array<{
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }>;
  moves: Array<{
    move: {
      name: string;
      url: string;
    };
  }>;
}


export const pokemonApi = {
  getPokemons: async (limit = 20, offset = 0): Promise<PokemonListResponse> => {
    const { data } = await apiClient.get<PokemonListResponse>('/pokemon', {
      params: { limit, offset },
    });
    return data;
  },

  getPokemonDetail: async (nameOrId: string | number): Promise<PokemonDetail> => {
    const { data } = await apiClient.get<PokemonDetail>(`/pokemon/${nameOrId}`);
    return data;
  },

  searchPokemon: async (query: string): Promise<PokemonDetail> => {
    const { data } = await apiClient.get<PokemonDetail>(`/pokemon/${query.toLowerCase()}`);
    return data;
  },
};