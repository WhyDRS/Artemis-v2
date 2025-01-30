{pkgs ? import <nixpkgs> {}}: let
  lib = pkgs.lib;
in
  pkgs.mkShell (with pkgs; {
    buildInputs = [
      nodejs
      openssl
      python312Packages.prisma
    ];

    shellHook = ''PATH="$PATH:$PWD/node_modules/.bin"'';

    PRISMA_SCHEMA_ENGINE_BINARY = "${prisma-engines}/bin/schema-engine";
    PRISMA_QUERY_ENGINE_BINARY = "${prisma-engines}/bin/query-engine";
    PRISMA_QUERY_ENGINE_LIBRARY = "${prisma-engines}/lib/libquery_engine.node";
    PRISMA_INTROSPECTION_ENGINE_BINARY = "${prisma-engines}/bin/introspection-engine";
    PRISMA_FMT_BINARY = "${prisma-engines}/bin/prisma-fmt";
  })
