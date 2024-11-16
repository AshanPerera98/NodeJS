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
