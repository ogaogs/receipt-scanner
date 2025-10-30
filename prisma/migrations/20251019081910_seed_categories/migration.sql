-- Seed default categories
INSERT INTO "categories" ("id", "name") VALUES
  (1, '食費'),
  (2, '水道光熱費'),
  (3, '家賃'),
  (4, '娯楽'),
  (5, '衣服・美容'),
  (6, '日用品'),
  (7, '病院代'),
  (8, '交通費'),
  (9, 'その他')
ON CONFLICT ("id") DO NOTHING;