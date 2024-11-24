# simple-fastapi-using-mysql-container-to-ecr-testuse

📟📟📟 簡単なFastAPIアプリケーション(DB操作あり)をECRにデプロイしてみる！  
※ DBとの接続性をテストするために、リクエストごとにDBに接続しています。  

[![ci](https://github.com/osawa-koki/simple-fastapi-using-mysql-container-to-ecr-testuse/actions/workflows/ci.yml/badge.svg)](https://github.com/osawa-koki/simple-fastapi-using-mysql-container-to-ecr-testuse/actions/workflows/ci.yml)
[![cd](https://github.com/osawa-koki/simple-fastapi-using-mysql-container-to-ecr-testuse/actions/workflows/cd.yml/badge.svg)](https://github.com/osawa-koki/simple-fastapi-using-mysql-container-to-ecr-testuse/actions/workflows/cd.yml)
[![Dependabot Updates](https://github.com/osawa-koki/simple-fastapi-using-mysql-container-to-ecr-testuse/actions/workflows/dependabot/dependabot-updates/badge.svg)](https://github.com/osawa-koki/simple-fastapi-using-mysql-container-to-ecr-testuse/actions/workflows/dependabot/dependabot-updates)

![成果物](./fruit.gif)  

## ローカルでの開発

以下のコマンドを実行してください。  

```shell
docker compose build
docker compose up -d
```

コンテナ内でPythonでの開発を行う場合には、以下のコマンドを実行してください。  

```shell
cd ./fastapi-app/

apt update
apt install python3.11-venv

python -m venv /myenv/
source /myenv/bin/activate
pip install -r ./requirements.txt

uvicorn main:app --reload --host 0.0.0.0 --port 80
```

## デプロイ

DevContainerに入り、以下のコマンドを実行してください。  
※ `~/.aws/credentials`にAWSの認証情報があることを前提とします。  

```shell
cdk deploy

export ECR_REPOSITORY_URI=$(aws ecr describe-repositories --repository-names fastapi-db-testuse-app --query 'repositories[0].repositoryUri' --output text)
aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_REPOSITORY_URI

docker build -t fastapi-db-testuse-app ./fastapi-app/
docker tag fastapi-db-testuse-app:latest $(echo $ECR_REPOSITORY_URI):latest
docker push $(echo $ECR_REPOSITORY_URI):latest
```

GitHub Actionsでデプロイする場合には、以下のシークレットを設定してください。  

| シークレット名 | 説明 |
| --- | --- |
| AWS_ACCESS_KEY_ID | AWSのアクセスキーID |
| AWS_SECRET_ACCESS_KEY | AWSのシークレットアクセスキー |
| AWS_REGION | AWSのリージョン |

タグをプッシュすると、GitHub Actionsがデプロイを行います。  
手動でトリガーすることも可能です。  

---

デプロイされたECRをローカルでテストする場合には、以下のコマンドを実行してください。  

```shell
docker compose down
docker compose up -d db

export ECR_REPOSITORY_URI=$(aws ecr describe-repositories --repository-names fastapi-db-testuse-app --query 'repositories[0].repositoryUri' --output text)
aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_REPOSITORY_URI

docker run --rm -p 80:80 --name fastapi-db-testuse-app -e DB_HOST=$(ipconfig getifaddr en0) -e DB_PORT=3306 -e DB_USERNAME=root -e DB_PASSWORD=rootpassword $(echo $ECR_REPOSITORY_URI):latest
```

以下のリクエストを送信して、DBの作成を行ってください。  

```bash
curl -X POST "http://localhost/databases" \
    -H "Content-Type: application/json" \
    -d '{"database": "your_database_name"}'
```
