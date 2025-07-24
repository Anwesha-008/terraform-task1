import { useState, useMemo, useEffect } from 'react';

const RECIPES = [
  {
    id: 1,
    title: 'Classic Chocolate Chip Cookies',
    category: 'Cookies',
    time: 30,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1600891963920-b8e6f822389b?q=80&w=1200&auto=format&fit=crop',
    ingredients: [
      '2 1/4 cups all-purpose flour',
      '1 tsp baking soda',
      '1 tsp salt',
      '1 cup butter, softened',
      '3/4 cup white sugar',
      '3/4 cup brown sugar',
      '2 large eggs',
      '2 cups chocolate chips'
    ],
    steps: [
      'Preheat oven to 175°C.',
      'Cream butter and sugars until fluffy.',
      'Beat in eggs one at a time.',
      'Mix dry ingredients, then combine.',
      'Fold in chocolate chips.',
      'Scoop onto tray and bake 9–11 minutes.'
    ]
  },
  {
    id: 2,
    title: 'No-Knead Rustic Bread',
    category: 'Bread',
    time: 240,
    difficulty: 'Medium',
    image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=1200&auto=format&fit=crop',
    ingredients: [
      '3 cups bread flour',
      '1/4 tsp instant yeast',
      '1 1/4 tsp salt',
      '1 1/2 cups water'
    ],
    steps: [
      'Mix all ingredients until shaggy dough forms.',
      'Cover and rest 12–18 hours.',
      'Shape, rest 30 mins.',
      'Bake in preheated Dutch oven at 230°C for 30 mins covered, 15 mins uncovered.'
    ]
  },
  {
    id: 3,
    title: 'Lemon Drizzle Cake',
    category: 'Cakes',
    time: 75,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1605478034040-04f1e6c0c4e6?q=80&w=1200&auto=format&fit=crop',
    ingredients: [
      '225g unsalted butter',
      '225g caster sugar',
      '4 eggs',
      '225g self-raising flour',
      '2 lemons (zest & juice)',
      '85g icing sugar'
    ],
    steps: [
      'Heat oven to 180°C and line a loaf tin.',
      'Beat butter & sugar, add eggs gradually.',
      'Fold in flour and lemon zest.',
      'Bake ~45–50 mins.',
      'Mix lemon juice & icing sugar, pour over warm cake.'
    ]
  }
];

const CATEGORIES = ['All', ...Array.from(new Set(RECIPES.map(r => r.category)))];
const DIFFICULTIES = ['All', ...Array.from(new Set(RECIPES.map(r => r.difficulty)))];

export default function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favorites') || '[]');
    } catch {
      return [];
    }
  });
  const [selected, setSelected] = useState(null); // recipe id for modal/details

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const filtered = useMemo(() => {
    return RECIPES.filter(r => {
      const matchesQuery =
        !query ||
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.ingredients.some(i => i.toLowerCase().includes(query.toLowerCase()));
      const matchesCategory = category === 'All' || r.category === category;
      const matchesDifficulty = difficulty === 'All' || r.difficulty === difficulty;
      return matchesQuery && matchesCategory && matchesDifficulty;
    });
  }, [query, category, difficulty]);

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const selectedRecipe = useMemo(
    () => RECIPES.find(r => r.id === selected) || null,
    [selected]
  );

  return (
    <div className="app">
      <header className="header container">
        <h1>🍞 BakeBook</h1>
        <p className="tagline">Your cozy corner for baking recipes</p>
      </header>

      <section className="search container">
        <input
          type="text"
          placeholder="Search recipes or ingredients…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />

        <div className="filters">
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
          {DIFFICULTIES.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
          </select>
        </div>
      </section>

      <main className="container">
        {filtered.length === 0 ? (
          <p className="muted">No recipes match your search.</p>
        ) : (
          <div className="grid">
            {filtered.map(r => (
              <article className="card" key={r.id}>
                {r.image && <img src={r.image} alt={r.title} className="thumb" />}
                <div className="card-body">
                  <h3>{r.title}</h3>
                  <p className="meta">
                    <span>{r.category}</span> • <span>{r.time} mins</span> • <span>{r.difficulty}</span>
                  </p>
                  <div className="card-actions">
                    <button className="btn" onClick={() => setSelected(r.id)}>View</button>
                    <button
                      className={`icon-btn ${favorites.includes(r.id) ? 'active' : ''}`}
                      onClick={() => toggleFavorite(r.id)}
                      title={favorites.includes(r.id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {favorites.includes(r.id) ? '★' : '☆'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {favorites.length > 0 && (
          <section className="favorites">
            <h2>★ Favorites</h2>
            <ul>
              {favorites.map(id => {
                const r = RECIPES.find(rr => rr.id === id);
                if (!r) return null;
                return (
                  <li key={id}>
                    <button className="link" onClick={() => setSelected(id)}>{r.title}</button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </main>

      <footer className="footer container">
        <p>Built with React + Vite • Happy baking! 🧁</p>
      </footer>

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelected(null)}
          onToggleFavorite={() => toggleFavorite(selectedRecipe.id)}
          isFavorite={favorites.includes(selectedRecipe.id)}
        />
      )}
    </div>
  );
}

function RecipeModal({ recipe, onClose, onToggleFavorite, isFavorite }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <h2>{recipe.title}</h2>
          <button className="icon-btn" onClick={onToggleFavorite}>
            {isFavorite ? '★' : '☆'}
          </button>
        </header>

        {recipe.image && <img src={recipe.image} alt={recipe.title} className="modal-img" />}

        <p className="meta">
          <span>{recipe.category}</span> • <span>{recipe.time} mins</span> • <span>{recipe.difficulty}</span>
        </p>

        <section>
          <h3>Ingredients</h3>
          <ul className="ingredients">
            {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
          </ul>
        </section>

        <section>
          <h3>Steps</h3>
          <ol className="steps">
            {recipe.steps.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </section>

        <button className="btn close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
