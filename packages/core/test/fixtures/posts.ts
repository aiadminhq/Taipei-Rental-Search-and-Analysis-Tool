export interface PostFixture { name: string; text: string; expect: Partial<{
  rent: number; areaPing: number; layout: string; roomType: string; city: string; district: string;
  mrtNearest: string; mrtWalkMin: number; phone: string; petPolicy: string; equipment: string[];
}> }

export const POSTS: PostFixture[] = [
  { name: 'threads-套房-完整', text: `#出租 大安區獨立套房
租金 14,500/月 含管理費，押二付一
約 8 坪，1房1衛，5F/7F 有電梯
變頻冷氣、冰箱、洗衣機、對外窗採光好
捷運科技大樓站 步行 6 分
可養貓 🐱 限一隻
洽 0912-345-678`,
    expect: { rent: 14500, areaPing: 8, layout: '1房1衛', roomType: '套房', city: '台北市', district: '大安區', mrtNearest: '科技大樓站', mrtWalkMin: 6, phone: '0912345678', petPolicy: 'allowed', equipment: ['變頻冷氣', '冷氣', '冰箱', '洗衣機', '對外窗', '電梯'] } },
  { name: 'fb-雅房-禁寵', text: `【中和 雅房出租】
月租 8000 元 押金兩個月
近捷運景安站走路約10分
提供冷氣 冰箱共用 洗衣機共用
不可養寵物 限女生`,
    expect: { rent: 8000, roomType: '雅房', city: '新北市', district: '中和區', mrtNearest: '景安站', mrtWalkMin: 10, petPolicy: 'not_allowed', equipment: ['冷氣', '冰箱', '洗衣機'] } },
  { name: 'ptt-整層', text: `[無/台北/中山] 整層住家 2房1廳1衛 近行天宮
租金：28000
坪數：18坪
樓層：3F/5F
設備：變頻冷氣x2、冰箱、洗衣機、電視
聯絡：請站內信`,
    expect: { rent: 28000, areaPing: 18, layout: '2房1廳1衛', roomType: '整層', city: '台北市', district: '中山區', equipment: ['變頻冷氣', '冷氣', '冰箱', '洗衣機', '電視'] } },
  { name: '591-標題只有價格', text: `信義區精緻獨立套房 近101 $16,000元/月`,
    expect: { rent: 16000, roomType: '套房', city: '台北市', district: '信義區' } },
  { name: '分租套房-無對外窗', text: `板橋分租套房 9500 無對外窗 但有冷氣 含網路`,
    expect: { rent: 9500, roomType: '分租', city: '新北市', district: '板橋區', equipment: ['冷氣', '網路'] } },
  { name: '萬與k寫法', text: `文山區套房 1.5萬 木柵站旁 走路3分 寵物可議`,
    expect: { rent: 15000, roomType: '套房', district: '文山區', mrtNearest: '木柵站', mrtWalkMin: 3, petPolicy: 'negotiable' } },
  { name: 'k寫法', text: `新店套房 12k 含水電 大坪林站 步行約 12 分鐘 可養寵物`,
    expect: { rent: 12000, roomType: '套房', city: '新北市', district: '新店區', mrtNearest: '大坪林站', mrtWalkMin: 12, petPolicy: 'allowed' } },
  { name: '電話有國碼', text: `士林雅房 7,000 洽 +886 987 654 321`,
    expect: { rent: 7000, roomType: '雅房', district: '士林區', phone: '0987654321' } },
];
