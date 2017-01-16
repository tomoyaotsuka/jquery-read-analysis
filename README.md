# jQuery Read Analysis

## Outline
設定エリアがビュー内に入り指定秒後にGA Eventを発火するjQueryプラグイン。  
1ランディングにつき、各指定エリアで1回ずつのみ発火する。


## Usage
```
$('#area').read({
  category: "category name",
  action:   "action name",
  label:    "label name",
  position: "default",
  runtime:  5000,
  gtm:      true,
  touch:    false,
  debug:    false
});
```


## Extra Config
| Key      | Value         | Description |
|:---------|:--------------|:------------|
| position | "default"     | 指定エリアがビュー内の1/2以上を占める場合を閲覧とみなす     |
|          | "cover"       | 指定エリアが表示された場合を閲覧とみなす                  |
| runtime  | 5000(default) | 指定エリアが設定ビュー内に入ってからイベント発火までのミリ秒 |
| gtm      | false         | ga('send', 'event', ~ )を使用する場合                |
| touch    | true          | touchend後の追加発火                                 |      
| debug    | true          | イベント発火とリセット時をコンソールに表示                |


## License

MIT
