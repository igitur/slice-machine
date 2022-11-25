import path from "path";
import { Models } from "@slicemachine/core";
import Files from "../../../../../lib/utils/files";
import { findIndexFile } from "../../../../../lib/utils/lib";
import { BackendEnvironment } from "../../../../../lib/models/common/Environment";

import * as LibrariesState from "../LibrariesState";
import * as Libraries from "@slicemachine/core/build/libraries";

const CODE_GENERATED_COMMENT = `// Code generated by Slice Machine. DO NOT EDIT.\n`;

const createIndexFile = (lib: Models.Library<Models.Component>) => {
  const { imports, exportList, componentsProperties } = lib.components.reduce(
    (
      acc: {
        imports: string;
        exportList: string;
        componentsProperties: string;
      },
      component
    ) => {
      const imports =
        acc.imports +
        `import ${component.model.name} from './${component.model.name}';\n`;
      const exportList = acc.exportList + `\t${component.model.name},\n`;
      const componentsProperties =
        acc.componentsProperties +
        `\t${component.model.id}: ${component.model.name},\n`;

      return { imports, exportList, componentsProperties };
    },
    { imports: "", exportList: "", componentsProperties: "" }
  );

  const exports = `export {\n${exportList}};\n`;
  const components = `export const components = {\n${componentsProperties}};\n`;

  return [CODE_GENERATED_COMMENT, imports, exports, components].join("\n");
};

const createIndexFileForSvelte = (lib: Models.Library<Models.Component>) => {
  let f = `${CODE_GENERATED_COMMENT}\n`;
  f += "const Slices = {}\n";
  f += "export default Slices\n\n";

  for (const c of lib.components) {
    f += `import ${c.model.name} from './${c.model.name}/index.svelte'\n`;
    f += `Slices.${c.model.name} = ${c.model.name}\n`;
  }
  return f;
};

const createIndexFileForFrameWork = (
  env: BackendEnvironment,
  lib: Models.Library<Models.Component>
) => {
  if (env.framework === Models.Frameworks.svelte)
    return createIndexFileForSvelte(lib);
  return createIndexFile(lib);
};

export default async function onSaveSlice(
  env: BackendEnvironment
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/await-thenable
  const libraries = await Libraries.libraries(
    env.cwd,
    env.manifest.libraries || []
  );
  const localLibs = libraries.filter((e) => e.isLocal);

  for (const lib of localLibs) {
    if (lib.components.length) {
      const { pathToSlice: relativePathToLib } = lib.components[0];
      const file = createIndexFileForFrameWork(env, lib);

      const pathToLib = path.join(env.cwd, relativePathToLib);

      const indexFilePath =
        findIndexFile(pathToLib) || path.join(pathToLib, "index.js");
      Files.write(indexFilePath, file);
    }
  }

  LibrariesState.generateState(env, libraries);
}
