'use client';

import { useState, useEffect } from 'react';
import { usePokemonList, useSearchPokemon } from '@/lib/hooks/usePokemon';
import { PokemonCard } from '@/components/PokemonCard';
import { useDebounce } from '@/lib/hooks/useDebounce';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = usePokemonList(20);

  const { data: searchResult, isLoading: isSearching, error: searchError } = useSearchPokemon(debouncedSearch);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
        handleLoadMore();
      }
    };

    if (!debouncedSearch) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [hasNextPage, isFetchingNextPage, debouncedSearch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Pokemon...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading Pokemon. Please try again later.</p>
        </div>
      </div>
    );
  }

  const allPokemons = data?.pages.flatMap((page) => page.results) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-10">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Pokédex</h1>
          <p className="text-gray-600 mb-6">Explore the world of Pokemon</p>

          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search Pokemon by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </header>

        {debouncedSearch ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isSearching ? (
              <div className="col-span-full text-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Searching...</p>
              </div>
            ) : searchError ? (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-600">No Pokemon found with name or ID: "{debouncedSearch}"</p>
              </div>
            ) : searchResult ? (
              <PokemonCard
                name={searchResult.name}
                url={`https://pokeapi.co/api/v2/pokemon/${searchResult.id}/`}
              />
            ) : null}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allPokemons.map((pokemon) => (
                <PokemonCard key={pokemon.name} name={pokemon.name} url={pokemon.url} />
              ))}
            </div>

            {isFetchingNextPage && (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading more...</p>
              </div>
            )}

            {!hasNextPage && allPokemons.length > 0 && (
              <div className="text-center py-10">
                <p className="text-gray-600">You've reached the end!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
