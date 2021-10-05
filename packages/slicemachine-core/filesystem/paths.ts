import path from "path";

export interface FileContent<T> {
  exists: boolean,
  content: T | null
}

const Paths = (cwd: string, prefix: string) => ({
  value: () => path.join(cwd, prefix),
  customType: (id: string) => ({
    value: () => path.join(Paths(cwd, prefix).value()),
    model: () => path.join(Paths(cwd, prefix).value(), id, "index.json"),
    mock: () => path.join(Paths(cwd, prefix).value(), id, "mocks.json"),
  }),
  library: (libraryName: string) => ({
    value: () => path.join(Paths(cwd, prefix).value(), libraryName),
    slice: (sliceName: string) => ({
      value: () =>
        path.join(Paths(cwd, prefix).library(libraryName).value(), sliceName),
      preview: (filename = "preview.png") =>
        path.join(
          Paths(cwd, prefix).library(libraryName).slice(sliceName).value(),
          filename
        ),
      stories: (filename = "index.stories.js") =>
        path.join(
          Paths(cwd, prefix).library(libraryName).slice(sliceName).value(),
          filename
        ),
      mocks: () =>
        path.join(
          Paths(cwd, prefix).library(libraryName).slice(sliceName).value(),
          "mocks.json"
        ),
      model: () =>
        path.join(
          Paths(cwd, prefix).library(libraryName).slice(sliceName).value(),
          "model.json"
        ),
      variation: (variationId: string) => ({
        value: () =>
          path.join(
            Paths(cwd, prefix).library(libraryName).slice(sliceName).value(),
            variationId
          ),
        preview: (filename = "preview.png") =>
          path.join(
            Paths(cwd, prefix)
              .library(libraryName)
              .slice(sliceName)
              .variation(variationId)
              .value(),
            filename
          ),
      }),
    }),
  }),
});

export const GeneratedPaths = (cwd: string) =>
  Paths(cwd, path.join(".slicemachine", "assets"));
export const GeneratedCustomTypesPaths = (cwd: string) =>
  Paths(cwd, path.join(".slicemachine", "assets", "customtypes"));
export const CustomTypesPaths = (cwd: string) => Paths(cwd, "customtypes");
export const CustomPaths = (cwd: string) => Paths(cwd, "");
export const PackagePaths = (cwd: string) => Paths(cwd, "node_modules");
export const SMConfig = (cwd: string) => path.join(cwd, "sm.json");
export const PrismicConfig = (cwd: string) => path.join(cwd, ".prismic");
export const SliceTemplateConfig = (
  cwd: string,
  customPathToTemplate?: string
) =>
  customPathToTemplate
    ? path.join(cwd, customPathToTemplate)
    : path.join(PrismicConfig(cwd), "slice-template");
export const JsonPackage = (cwd: string) => path.join(cwd, "package.json");
export const YarnLock = (cwd: string) => path.join(cwd, "yarn.lock");
export const MocksConfig = (cwd: string) =>
  path.join(cwd, ".slicemachine", "mock-config.json");
