# Part 5. 디버거 사용법

---

## Ch 2. Debugger 세팅하고 사용해보기

Debugger 세팅

`.vscode/launch.json`

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Debug Nest Framework",
            "runtimeExecutable": "pnpm",
            "runtimeArgs": [
                "run",
                "start:debug",
                "--",
                "--inspect-brk"
            ],
            "autoAttachChildProcesses": true,
            "restart": true,
            "sourceMaps": true,
            "stopOnEntry": false,
            "console": "integratedTerminal"
        }
    ]
}
```