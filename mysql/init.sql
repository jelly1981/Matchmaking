-- MySQL 8.4.6 初期化設定 (t3.small最適化)
-- 多くの設定は起動時パラメータまたはmy.cnfで設定済み

-- UTF8MB4サポートを確保
ALTER DATABASE wordpress CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 実行時に変更可能なパラメータのみ設定
SET GLOBAL innodb_io_capacity=200;
SET GLOBAL thread_cache_size=16;

-- 最適化インデックスの作成
-- (これらはWordPressインストール後に自動作成される)