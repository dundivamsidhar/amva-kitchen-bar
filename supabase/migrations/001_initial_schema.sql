-- AmVa Kitchen & Bar — Initial Schema
-- Run this in your Supabase SQL editor

-- Menu Categories
create table if not exists menu_categories (
  id serial primary key,
  name text not null,
  slug text not null unique,
  icon text,
  display_order int not null default 0,
  created_at timestamptz default now()
);

-- Menu Items
create table if not exists menu_items (
  id serial primary key,
  category_id int not null references menu_categories(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10, 2) not null,
  image_url text,
  tags text[],
  is_available boolean not null default true,
  is_featured boolean not null default false,
  is_vegetarian boolean not null default false,
  is_vegan boolean not null default false,
  spice_level int check (spice_level between 0 and 3),
  created_at timestamptz default now()
);

-- Reservations
create table if not exists reservations (
  id serial primary key,
  name text not null,
  email text not null,
  phone text not null,
  date date not null,
  time text not null,
  guests int not null check (guests between 1 and 20),
  occasion text,
  special_requests text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table menu_categories enable row level security;
alter table menu_items enable row level security;
alter table reservations enable row level security;

-- Public read access for menu
create policy "Anyone can read menu categories" on menu_categories
  for select using (true);

create policy "Anyone can read available menu items" on menu_items
  for select using (is_available = true);

-- Anyone can insert a reservation (public booking)
create policy "Anyone can create a reservation" on reservations
  for insert with check (true);

-- Seed: Categories
insert into menu_categories (name, slug, icon, display_order) values
  ('Starters', 'starters', '🥗', 1),
  ('Sharing Plates', 'sharing-plates', '🫕', 2),
  ('Mains', 'mains', '🍛', 3),
  ('Biryani & Rice', 'biryani-rice', '🍚', 4),
  ('Desserts', 'desserts', '🍮', 5),
  ('Signature Cocktails', 'cocktails', '🍹', 6),
  ('Mocktails', 'mocktails', '🥤', 7),
  ('Wines & Spirits', 'wines-spirits', '🍷', 8)
on conflict (slug) do nothing;

-- Seed: Menu Items
insert into menu_items (category_id, name, description, price, tags, is_vegetarian, is_vegan, is_featured, spice_level) values
  -- Starters
  (1, 'Hyderabadi Galouti Kebab', 'Melt-in-your-mouth minced lamb patties with saffron & rose petal chutney', 495, array['chef-special','gluten-free'], false, false, true, 1),
  (1, 'Panner Tikka 65', 'Chargrilled cottage cheese in smoky spiced marinade, mint yoghurt dip', 395, array['vegetarian','chef-special'], true, false, true, 2),
  (1, 'Crispy Lotus Stems', 'Flash-fried lotus root, chilli-lime salt, tamarind glaze', 345, array['vegan','gluten-free'], true, true, false, 1),
  (1, 'Prawn Koliwada', 'Mumbai-style battered prawns, kokum mayo, curry leaf oil', 545, array['seafood'], false, false, false, 2),
  (1, 'Dal Shorba', 'Velvet lentil broth, smoked butter, crispy shallots', 225, array['vegetarian'], true, false, false, 0),

  -- Sharing Plates
  (2, 'Mezze of the Deccan', 'Baingan bharta, walnut chutney, pomegranate raita, mini naan basket', 695, array['vegetarian','sharing'], true, false, false, 1),
  (2, 'Chaat Board', 'Pani puri, sev puri, dahi vada, papdi chaat — street food all on one board', 595, array['vegetarian','street-food'], true, false, true, 1),
  (2, 'Mixed Grill Platter', 'Tandoori chicken, seekh kebab, fish tikka, lamb chops, green chutney & pickles', 1295, array['mixed','tandoor'], false, false, true, 2),

  -- Mains
  (3, 'Dum Ka Gosht', 'Slow-cooked Hyderabadi lamb curry, caramelised onion, stone-flower spice', 695, array['signature','gluten-free'], false, false, true, 2),
  (3, 'Butter Chicken — AmVa Style', 'Tandoor-roasted chicken in smoked tomato & fenugreek sauce, finishing butter', 595, array['bestseller'], false, false, true, 1),
  (3, 'Coastal Prawn Masala', 'Konkan-style tiger prawns, raw mango, coconut milk curry, appam', 745, array['seafood','gluten-free'], false, false, false, 3),
  (3, 'Wild Mushroom & Truffle Kofta', 'Handmade mushroom dumplings in makhani sauce, truffle oil finish', 545, array['vegetarian','chef-special'], true, false, false, 1),
  (3, 'Raan-e-Deccan', 'Whole slow-roasted lamb shoulder (serves 2–3), pomegranate jus, roomali roti', 1895, array['sharing','signature','pre-order'], false, false, false, 2),
  (3, 'Paneer Lababdar', 'Rich tomato-cashew gravy, chargrilled cottage cheese, fresh cream', 495, array['vegetarian'], true, false, false, 1),

  -- Biryani & Rice
  (4, 'Hyderabadi Dum Biryani — Mutton', 'The original — aged basmati, whole spices, slow-steamed in sealed handi', 695, array['signature','bestseller'], false, false, true, 2),
  (4, 'Hyderabadi Dum Biryani — Chicken', 'Classic kachchi method, caramelised onion, mint, saffron', 595, array['signature','bestseller'], false, false, true, 2),
  (4, 'Veg Biryani', 'Garden vegetables, paneer, saffron, dry fruits, dum sealed', 495, array['vegetarian'], true, false, false, 1),
  (4, 'Prawn Dum Biryani', 'Tiger prawns, coastal spices, coconut, fresh coriander', 795, array['seafood','signature'], false, false, false, 2),
  (4, 'Jeera Rice', 'Basmati rice tempered with cumin, ghee & fresh herbs', 175, array['vegetarian','side'], true, false, false, 0),

  -- Desserts
  (5, 'Double Ka Meetha', 'Hyderabadi bread pudding, rose water, pistachios, silver leaf', 295, array['signature','vegetarian'], true, false, true, 0),
  (5, 'Gulab Jamun Cheesecake', 'Cardamom cream cheese, gulab jamun insert, rose coulis', 345, array['fusion','vegetarian'], true, false, true, 0),
  (5, 'Kulfi on a Stick', 'Pistachio & rose, mango & chilli, or malai — choose your flavour', 225, array['vegetarian','gluten-free'], true, false, false, 0),
  (5, 'Warm Chocolate Fondant', 'Dark chocolate lava cake, saffron ice cream, gold leaf', 375, array['vegetarian'], true, false, false, 0),

  -- Signature Cocktails
  (6, 'AmVa Sour', 'Maker''s Mark bourbon, fresh tamarind, curry leaf syrup, egg white, smoked chilli rim', 695, array['signature','bestseller'], true, false, true, 0),
  (6, 'Hyderabad Negroni', 'Empress 1908 gin, Campari, cardamom-infused vermouth, charred orange', 745, array['signature'], true, false, true, 0),
  (6, 'Mango Lassi Margarita', 'Patron Silver, Alphonso mango, saffron sugar, Tajín rim', 695, array['seasonal','fusion'], true, false, false, 0),
  (6, 'Masala Chai Old Fashioned', 'Woodford Reserve, spiced chai reduction, Angostura bitters, star anise smoke', 745, array['signature','chef-special'], true, false, true, 0),
  (6, 'Rose Garden', 'Hendrick''s gin, lychee, rose water, St-Germain, elderflower foam', 695, array['floral'], true, false, false, 0),
  (6, 'Kokum Daiquiri', 'Havana Club 3yr, kokum shrub, cane syrup, lime, activated charcoal salt', 645, array['tropical'], true, false, false, 0),

  -- Mocktails
  (7, 'Virgin AmVa Sour', 'Tamarind, curry leaf soda, ginger, lime, egg white foam', 395, array['signature','non-alcoholic'], true, true, true, 0),
  (7, 'Spiced Watermelon Cooler', 'Fresh watermelon, jalapeño, mint, black salt, soda', 345, array['refreshing','non-alcoholic'], true, true, false, 1),
  (7, 'Turmeric Ginger Fizz', 'Cold-pressed turmeric, ginger, lemon, honey, ginger beer', 345, array['wellness','non-alcoholic'], true, true, false, 0),
  (7, 'Mango Chilli Lemonade', 'Alphonso mango purée, chilli, basil, lemon, sparkling water', 345, array['tropical','non-alcoholic'], true, true, false, 1),

  -- Wines & Spirits
  (8, 'Sula Vineyards Rasa Cabernet Sauvignon', 'Rich blackberry, spice finish — Nashik Valley', 595, array['indian-wine','red'], true, false, false, 0),
  (8, 'Grover Zampa Chardonnay', 'Crisp citrus, light oak — Nandi Hills', 545, array['indian-wine','white'], true, false, false, 0),
  (8, 'Kingfisher Ultra Draught', '330ml | Chilled & fresh', 250, array['beer'], true, false, false, 0),
  (8, 'Jack Daniel''s — House Pour', '30ml | Tennessee whiskey', 450, array['spirits'], true, false, false, 0);
