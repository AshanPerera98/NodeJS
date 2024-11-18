# NPM Versioning

### Nmbering

xx.xx.xx
major version | minor version | patch version

- patch version - bug fixes
- minor version - new features withoutbreaking changes (backwords compatible)
- major version - major breaking changes (not backwards compatible)

### Vrsion Updating

~1.1.x
^1.x.x
\*x.x.x

- (~) will only update the patch version
- (^) will update the minor vversion with pathc version
- (\*) will update every thing

### Commands

to check for outdated packages

```
    npm outdated
```

to update packages

```
    npm update (package name)
```

---

# Event Loop in NodeJS

<b>Execution order</b>

1. Initailize program
2. Execute top-level code
3. Require modules
4. Register event callbacks
5. Envent loop

### Event loop

1. Timer callbacks
2. I/O callbacks
3. setImmediate callbacks
4. Close callbacks
5. any pending timers or callbacks ? repeat loop : exit program
