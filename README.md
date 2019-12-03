qiitaにも同じ内容の記事を書いています。
https://qiita.com/pn8128/items/0b1d576acb281073aca4

# はじめに

Slackをつかって仕事をする方、最近多いのではないでしょうか。

リアクションを飛ばせたり、チャンネルごとに通知設定ができたりと何かと便利なSlackですが、Freeプランを使ってるといつの間にか過去のファイルが消えている...

Freeプランではワークスペース全体のストレージが5GBしかなく、過去事例の参照や引継ぎを阻んでいます。

なんとかならないものか...しかし金はかけたくない。

そこで、 **Slackのファイルを丸ごとgoogleDriveにアップロード** してしまおうと思います。

しかも、GASを使えば驚くほど簡単にしかもサーバーレスで書けるのです！

特にGSuitを使っている方はgoogleDrive容量が十分あると思われるため、うってつけです！

# Slack上のファイルを全てgoogleDriveにアップロードするコード

## 仕様

今回のシステムは、slack上の操作をトリガーにするのではなく、cronにより毎日実行するものです。叩くのもslackAPIのみとなります。

以下のように動作します。

1. Slackのchannelのlistを取得。
2. channelのIDと適切なタイムスタンプを用いて、欲しいfileのlistを取得。
3. fileのidを用いて,ファイルをchannelごとにGoogle Driveに保存する。
4. 2~3を繰り返す。


## 準備

### SlackのAccess Tokenの取得

Slackアプリをを作りましょう。

まず<a href="https://api.slack.com/apps">ここ</a>にアクセスして新しいアプリを作成します。次にOAuth & Permissionsから、以下のスコープを追加します。


- files:read　ファイルの取得のために必要です。
- channels:read　チャンネルの取得のために必要です。

スコープを追加したら、忘れないうちにアプリをワークスペースにインストールしてしまいましょう。

ここででてくる**OAuth Access Token**は今後使います。

(それ以外は使いませんので、すでにSlackアプリを制作したことがある場合は既存のアプリに上記permissionを足してAccessTokenだけを使っても構いません。)

### googleDriveのFolderIDの取得

次にGoogleDriveで使用するフォルダに移動します。

<img width="593" alt="googleFolderID.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/545134/5b896e6c-9820-eac6-c840-cd1c490a2522.png">

URLのfoldersの後の部分がFolderIDとなります。

## プログラム

先ほど取得したAccessTokenは適宜「ファイル > プロジェクトのプロパティ > スクリプトのプロパティ」に「TOKEN」の名前で登録してください。アップロード先のGoogle DriveのFolderIDも同様に「FOLDER_ID」の名前で登録する必要があります。

<img width="596" alt="scriptProperty0.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/545134/aba63f6d-0123-38ad-146b-635604d6facb.png">

<img width="683" alt="scriptProperty.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/545134/5c62ce2a-8c29-b100-c3c0-24ca9112ca94.png">

コードはmain.gs参照。

## 定期実行

<img width="562" alt="スクリーンショット 2019-12-04 5.16.32.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/545134/c2c67aa8-6db3-0070-dd60-cd101d47342b.png">
ここから、トリガーを追加して、動かしたい時間に動かせば、定期実行されます。

cronも簡単だね！

# まとめ

GASで50行ちょいのコードでもSlackがより使いやすくなるので、ぜひ導入してみてください！



# 関連記事
[Slackのストレージを消費せずにファイルをアップロード ～アップロードされたファイルを即座にGoogle Driveに転送する～](https://qiita.com/GMA/items/7e3e7cedcb880f2c1dc9)
コードを書く時とqiitaを書くときに参考にさせていただきました。こちらの方は、即時応答のプログラムですね。
