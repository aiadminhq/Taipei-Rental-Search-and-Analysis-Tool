# PWA 圖示檔案

## 需要的圖示尺寸

根據 manifest.json，需要以下尺寸的圖示：

- icon-72x72.png
- icon-96x96.png  
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## 生成圖示的方法

### 方法 1: 線上工具 (推薦)
1. 前往 https://realfavicongenerator.net/
2. 上傳 icon-base.svg
3. 下載生成的圖示包
4. 將檔案放入此目錄

### 方法 2: PWA Builder
1. 前往 https://www.pwabuilder.com/imageGenerator
2. 上傳 icon-base.svg
3. 下載 PWA 圖示包

### 方法 3: 使用 ImageMagick (如果已安裝)
```bash
# 從 SVG 生成不同尺寸的 PNG
convert icon-base.svg -resize 72x72 icon-72x72.png
convert icon-base.svg -resize 96x96 icon-96x96.png
convert icon-base.svg -resize 128x128 icon-128x128.png
convert icon-base.svg -resize 144x144 icon-144x144.png
convert icon-base.svg -resize 152x152 icon-152x152.png
convert icon-base.svg -resize 192x192 icon-192x192.png
convert icon-base.svg -resize 384x384 icon-384x384.png
convert icon-base.svg -resize 512x512 icon-512x512.png
```

## 臨時解決方案

目前已建立 icon-base.svg 作為基礎圖示。
可以暫時將 manifest.json 中的圖示路徑指向這個 SVG 檔案。
