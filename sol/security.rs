use solana_security_txt::security_txt;

#[cfg(not(feature = "no-entrypoint"))]
security_txt! {
    name: "jewl.app",
    project_url: "https://jewl.app",
    contacts: "link:https://github.com/jewl-app/.github/security/advisories/new",
    policy: "https://github.com/jewl-app/.github/security/policy",
    source_code: "https://github.com/jewl-app/.github",
    version: env!("CARGO_PKG_VERSION")
}
