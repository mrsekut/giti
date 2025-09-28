# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
bun install

# Start development server with hot reload
bun dev

# Run production server
bun start

# Build the project
bun run build

# Type check
bun run typecheck

# Format code
bun run format

# Run tests
bun run test

# Run typecheck, format, and tests
bun run check
```

## TypeScript Guidelines

### 基本原則

- 型定義は interface ではなく、type を使用する
- for よりも map や filter などの関数型メソッドを優先して使用する
- 変数の宣言には const のみを使用する
- 外部で使われていない場合は export しない
- 使用していない import や変数や関数などは削除
- class は使用せず、関数を使用する

### インポート・エクスポート

- ES Modules 使用時は .js 拡張子を明示してインポート
- 相対パス指定時は一貫したベースパスを使用
- デフォルトエクスポートよりも名前付きエクスポートを優先

### 型安全性

- any 型の使用を避け、適切な型定義を行う
- オプショナル型は `?:` を使用
- Union types で状態を明確に表現
- 配列アクセス時は bounds check を実装

### エラーハンドリング

- Promise ベースの処理では適切な catch を実装
- 型ガードを使用して実行時型チェックを行う
- Error 型を継承したカスタムエラークラスを定義

## React Guidelines

### コンポーネント設計

- props の型は `Props` という名前にする
- できる限り 1 つのファイルには 1 の component のみ定義すべきだが、そのファイルでのみ使用されている小さい component などは同じファイルに定義しても良い
- component は小さく分割する
- ロジックと UI は分離する

### 状態管理

- ローカル状態は useState
- グローバル状態は jotai を使用
- setState の関数型更新を活用

### エラーハンドリング

- ユーザーに分かりやすいエラーメッセージを表示
- 非同期処理のエラーは状態として管理

## General Coding Practices

### 原則

#### 関数型アプローチ

- 純粋関数を優先
- 不変データ構造を使用
- 副作用を分離
- 型安全性を確保

#### ドメイン駆動設計 (DDD)

- 『Domain Modeling Made Functional』の原則に従う
- 過度な抽象化を避ける
- コードよりも型を重視

#### テスト駆動開発 (TDD)

- Red-Green-Refactor サイクル
- テストを仕様として扱う
- 小さな単位で反復
- 継続的なリファクタリング

#### 使用していないものは消す

- 使用していない変数や関数は消す
- 使用していない import は消す
- 使用していないライブラリは消す
- 不要になったファイルは消す
- 先を見越して過剰な method を先に定義しない

### 実装手順

1. **型設計**

   - まず型を定義
   - ドメインの言語を型で表現

2. **純粋関数から実装**

   - 外部依存のない関数を先に
   - テストを先に書く

3. **副作用を分離**

   - IO 操作は関数の境界に押し出す
   - 副作用を持つ処理を Promise でラップ

4. **アダプター実装**
   - 外部サービスや DB へのアクセスを抽象化
   - テスト用モックを用意

### ディレクトリ構成は Package by Feature

機能単位でコードを整理し、関連するファイルをすべて同じディレクトリにまとめる
技術単位でディレクトリを分けるのではなく、機能単位でまとめることで、必要なファイルを一箇所で把握しやすくなる。

```
src/
  features/
    auth/
      LoginForm.tsx
      useLogin.ts
      service.ts
      types.ts
      test.ts
    user/
      UserProfile.tsx
      useUserProfile.ts
      service.ts
      types.ts
      test.ts
```

原則として以下のような名称のディレクトリは作成しない: components, hooks, services, types, tests, etc.

### コードスタイル

- 基本的に関数で実装し、class は一切使用しない
- main 関数を上部に配置
- 関数を小さく分割し、一つの関数の内部は抽象度が揃った可読性の高いコードにする
- コミット前にコードフォーマットを実行
- 早期リターンで条件分岐をフラット化

### テスト戦略

- 純粋関数の単体テストを優先
- インメモリ実装によるリポジトリテスト
- テスト可能性を設計に組み込む
- アサートファースト：期待結果から逆算

### MVP を重視する実装方針

- MVP の作成を重視し、その後段階的に拡張する方針で進める
- MVP を作成するために優先順位を判断して実装方針を提案する
- レビュー時に動作確認しやすい
- 前もって不要にロジックを作りすぎるのを避けられる

### レビュー

- ユーザに確認を促す前に自分で動作確認やレビューを行う
- ユーザに確認を促す際は、動作確認の手順やレビューすべきポイントなども提示する

## Git Practices

### コミットの作成

- できるだけ小さい粒度で commit を作成する
- commit 前に、format, lint, typecheck, test を実行する

1. 変更の分析

   - 変更または追加されたファイルの特定
   - 変更の性質（新機能、バグ修正、リファクタリングなど）の把握
   - プロジェクトへの影響評価
   - 機密情報の有無確認

2. コミットメッセージの作成
   - 「なぜ」に焦点を当てる
   - 明確で簡潔な言葉を使用
   - 変更の目的を正確に反映
   - 一般的な表現を避ける

### 補足

- 可能な場合は `git commit -am`や fixup を使用
- 関係ないファイルは含めない
- 空のコミットは作成しない
- git 設定は変更しない

### コミットメッセージの例

```bash
# 新機能の追加
feat: エラー処理の導入

# 既存機能の改善
update: キャッシュ機能のパフォーマンス改善

# バグ修正
fix: 認証トークンの期限切れ処理を修正

# リファクタリング
refactor: Adapterパターンを使用して外部依存を抽象化

# テスト追加
test: エラーケースのテストを追加

# ドキュメント更新
docs: エラー処理のベストプラクティスを追加
```
