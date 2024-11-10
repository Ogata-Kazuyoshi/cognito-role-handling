# Role-handling & AWS-SES

<details open="open">
<summary>目次</summary>


- [今回のシステム概要図](#今回のシステム概要図)
- [cognitoの設定](#cognitoの設定)
- [sesの設定](#sesの設定)
- [備考](#備考)
- [参考](#参考)
</details>

# 今回のシステム概要図
<details>
<summary> システム概要図</summary>

</details>


# cognitoの設定

<details>
<summary> 1. 特に別のIdPと連携しないなら、チェックなしで次に</summary>

![](assets/images/cognito1.png)

</details>

<details>
<summary> 2. MFA認証は入れる方がおすすめ</summary>

![](assets/images/cognito2.png)

</details>

<details>
<summary> 3. とりあえずエラーが出るのでCognitoの方を設定</summary>

![](assets/images/cognito3.png)

</details>

<details>
<summary> 4. アプリケーションとの統合部分（やること多い）</summary>

- ホストされた認証ページにチュックを入れて、springsecurityのauthorize-urlからアクセスできるCognitoドメインの作成
- 秘密クライエントにチェックを入れて、シークレットの生成
- コールバックURIの登録
- スコープをopenIDで設定（できるだけ少ない情報にしたかった）
- 実際に取れそうなPrincipalは下記の添付

![](assets/images/cognito4.png)
![](assets/images/cognito5.png)
![](assets/images/cognito6.png)
![](assets/images/cognito-principal.png)

</details>

# sesの設定

<details>
<summary> 1. IDの作成</summary>

- ①のIDをクリック
- ②IDの作成をクリック

![](assets/images/ses-1.png)

</details>

<details>
<summary> 2.ドメインor メールアドレスを登録</summary>

- ③今回の例は、Eメールをチェックして、アドレスを記入
- ④IDの作成をクリック

![](assets/images/ses-2.png)

</details>

<details>
<summary> 3. 登録したメールの検証</summary>

- ⑤「検証保留中」になっているため、登録したメールアドレスに届いているメールで検証を進める。検証されると「検証済み」になる
- この検証を実施しないと、SESがメール送信できない。サンドボックスモードの場合は、受信メアドもこの検証処理が事前に必要

![](assets/images/ses-3.png)

</details>


# 備考

# 参考
