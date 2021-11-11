declare class AuthScopes {
    static SCOPE_DELIMITER: string;
    private compressedScopes;
    private expandedScopes;
    constructor(scopes: string | string[] | undefined);
    has(scope: string | string[] | AuthScopes | undefined): boolean;
    equals(otherScopes: string | string[] | AuthScopes | undefined): boolean;
    toString(): string;
    toArray(): string[];
    private getImpliedScopes;
}
export { AuthScopes };
//# sourceMappingURL=index.d.ts.map