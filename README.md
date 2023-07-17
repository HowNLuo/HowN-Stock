# 前言
提供使用者**登入、註冊、查詢股票交易紀錄、編輯投資組合、記錄持股明細**。

## 登入
![](https://hackmd.io/_uploads/S1_P9FoKh.png)
提供使用者登入、註冊
> 運用技術：firebase的auth API、setTimeout自動登出

## 首頁
![](https://hackmd.io/_uploads/Sk6C5cMKh.png)

提供使用者輸入股票代號，查詢個股30日內交易紀錄，以table呈現，並使用chart.js繪製折線圖，可以一眼看出股票走勢。欲追蹤之標的，可點選**加入投資組合**將個股加入至投資組合中。
> 運用技術：finmind、chart.js、ngModel
## 投資組合
![](https://hackmd.io/_uploads/Hkt3p9zKh.png)

提供使用者對投資組合類別進行新增、編輯、排序、刪除，及查看追蹤標的資訊、並提供刪除鈕。
> 運用技術：drag拖曳功能、ngModel

## 持股明細
![](https://hackmd.io/_uploads/Bk16pqzY2.png)
提供使用者對持股明細進行新增、編輯、排序、刪除，並以chart.js繪製圓餅圖。
> 運用技術：chart.js、Reactived Form

## 其他
錯誤處理、bootstrap、ngx-bootstrap、後端網站(firebase)、OpenAPI(finmind)、authGuard

## 待開發
SCSS設定顏色變數、股票詳細資料、排版、持股明細頁的折線圖、登入(不要存在localStorage)
