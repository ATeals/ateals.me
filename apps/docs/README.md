# Ateals의 외장 아카이브

- obsidian
- Nextra

### 동작

DocsManager 객체의 input 을 입력하고 output을 next pages 폴더 위치로 연결합니다.

```ts
const manager = new DocsManager({
  input: "../../documents/docs",
  output: "./pages",
  excludes: EXCLUDES_DIR,
  fileEvents: [
    {
      fileExt: "md",
      handler: (destFile: string): string => {
        destFile = Utils.convertToMdx(destFile);
        return Utils.hashFileName(destFile);
      },
    },
  ],
});
```

배포 전에 manager 객체의 다음 메서드들을 실행합니다.

```ts
manager.cleanOutput().makeDocs();
```
