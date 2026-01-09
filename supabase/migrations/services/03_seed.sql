insert into public.services (name, sort_order)
values
  ('Tiling', 1),
  ('Plumbing', 2),
  ('Electrical', 3),
  ('Carpentry', 4),
  ('Ceiling', 5),
  ('Glass Work', 6),
  ('Masonry', 7),
  ('Planning', 8),
  ('Designing', 9),
  ('Construction Company', 10)
on conflict (name) do nothing;

with tiling as (
  select id from public.services where name = 'Tiling'
)
insert into public.sub_services (service_id, name, unit, default_price, sort_order)
select tiling.id, data.name, data.unit, data.default_price, data.sort_order
from tiling
cross join (
  values
    ('Floor Tiling', 'sq.ft', 120, 1),
    ('Wall Tiling', 'sq.ft', 130, 2),
    ('Mosaic Tiling', 'sq.ft', 650, 3),
    ('Bathroom Tiling', 'sq.ft', 500, 4),
    ('Staircase Tiling', 'sq.ft', 700, 5),
    ('Pantry Top / Backsplash', 'lin.ft', 1200, 6),
    ('Skirting', 'lin.ft', 120, 7)
) as data(name, unit, default_price, sort_order)
on conflict (service_id, name) do nothing;
