import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAudio } from '../context/AudioContext';
import {
  Globe2,
  Search,
  Sparkles,
  ExternalLink,
  Calendar,
  Camera,
  Info,
  ShieldCheck,
} from 'lucide-react';

export const NasaExplorer: React.FC = () => {
  const { playClick } = useAudio();
  const [apodData, setApodData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>('Mars Rover');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isLoadingApod, setIsLoadingApod] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    const fetchApod = async () => {
      try {
        const res = await api.getNasaApod();
        if (res.success && res.data) {
          setApodData(res.data);
        }
      } catch (err) {
        console.error('Failed to load APOD', err);
      } finally {
        setIsLoadingApod(false);
      }
    };

    fetchApod();
    handleSearch('Mars Rover');
  }, []);

  const handleSearch = async (queryText = searchQuery) => {
    if (!queryText.trim()) return;
    setIsSearching(true);
    try {
      const res = await api.searchNasaImages(queryText);
      if (res.success && res.results) {
        setSearchResults(res.results);
      }
    } catch (err) {
      console.error('NASA search failed', err);
    } finally {
      setIsSearching(false);
    }
  };

  const quickSearchQueries = ['Mars Rover', 'James Webb', 'Apollo 11', 'International Space Station', 'Europa', 'Nebula'];

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-space-900 border border-space-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-semibold tracking-wider uppercase mb-1">
              <Globe2 className="w-4 h-4" />
              <span>Deep Space Public Data Portal</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              NASA Cosmic Explorer
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Direct integration with NASA Open APIs. Explore the Astronomy Picture of the Day (APOD) and live archives from the NASA Image and Video Library.
            </p>
          </div>

          <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-space-950/80 border border-space-800 text-[11px] font-mono text-emerald-400 shrink-0">
            <ShieldCheck className="w-4 h-4" />
            <span>NASA Open Data Certified</span>
          </div>
        </div>
      </div>

      {/* Astronomy Picture of the Day (APOD) Hero Section */}
      <div className="bg-space-900 border border-space-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-6 bg-space-850/80 border-b border-space-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="font-display font-bold text-sm sm:text-base text-white">
              Astronomy Picture of the Day (APOD)
            </h3>
          </div>
          {apodData?.date && (
            <span className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono">
              <Calendar className="w-3.5 h-3.5" />
              <span>{apodData.date}</span>
            </span>
          )}
        </div>

        {isLoadingApod ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : apodData ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 sm:p-8">
            {/* Image Preview */}
            <div className="rounded-2xl overflow-hidden bg-space-950 border border-space-800 relative group flex items-center justify-center max-h-[420px]">
              <img
                src={apodData.url}
                alt={apodData.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-space-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <a
                  href={apodData.hdurl || apodData.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 text-space-950 text-xs font-bold shadow-lg"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View High Resolution Original</span>
                </a>
              </div>
            </div>

            {/* Explanation & Details */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                <h4 className="font-display font-bold text-xl sm:text-2xl text-white mb-2 leading-snug">
                  {apodData.title}
                </h4>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-h-64 overflow-y-auto pr-2">
                  {apodData.explanation}
                </p>
              </div>

              <div className="pt-4 border-t border-space-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
                <span>
                  Source: <span className="text-cyan-300 font-mono">{apodData.copyright || 'NASA Public Domain'}</span>
                </span>
                <span className="font-mono text-[10px] text-slate-500">
                  Data Stream: api.nasa.gov
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs">
            APOD data temporarily unavailable from source server.
          </div>
        )}
      </div>

      {/* NASA Image and Video Library Search Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-xl text-white">
              NASA Image and Video Archive
            </h3>
            <p className="text-xs text-slate-400">
              Query millions of historical and modern missions across JPL, JSC, Kennedy, and Goddard centers.
            </p>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex items-center space-x-2 w-full sm:w-auto"
          >
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Mars, Apollo, Webb..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-space-900 border border-space-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              type="submit"
              onClick={() => playClick()}
              disabled={isSearching}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-space-950 font-bold text-xs transition-colors shadow-sm shadow-cyan-500/20"
            >
              {isSearching ? 'Querying...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Quick query chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider shrink-0">
            Suggested:
          </span>
          {quickSearchQueries.map((chip) => (
            <button
              key={chip}
              onClick={() => {
                playClick();
                setSearchQuery(chip);
                handleSearch(chip);
              }}
              className="px-3 py-1 rounded-lg text-xs bg-space-900 border border-space-800 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 whitespace-nowrap transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Search Results Grid */}
        {isSearching ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {searchResults.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  playClick();
                  setSelectedImage(item);
                }}
                className="bg-space-900 border border-space-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between transition-all"
              >
                <div className="h-44 bg-space-950 overflow-hidden relative">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {item.center && (
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-space-950/80 text-[10px] font-mono text-cyan-300 border border-space-800">
                      {item.center}
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-1">
                  <h5 className="font-semibold text-white text-xs line-clamp-2 leading-snug group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h5>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal for Selected Image */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-space-950/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="bg-space-900 border border-space-700 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-cyan-400 font-bold">
                NASA ID: {selectedImage.nasa_id}
              </span>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-space-800 rounded-lg"
              >
                Close ✕
              </button>
            </div>

            <img
              src={selectedImage.full_url || selectedImage.image_url}
              alt={selectedImage.title}
              className="w-full max-h-[420px] object-contain rounded-xl bg-space-950"
            />

            <div>
              <h3 className="font-display font-bold text-lg text-white mb-2">
                {selectedImage.title}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {selectedImage.description}
              </p>
            </div>

            <div className="pt-3 border-t border-space-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
              <span>Date: {selectedImage.date_created?.slice(0, 10)}</span>
              <span>Center: {selectedImage.center || 'NASA'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
