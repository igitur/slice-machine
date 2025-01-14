import fs from "fs";
import path from "path";

import * as Libraries from "@slicemachine/core/build/libraries";
import {
  CustomPaths,
  GeneratedPaths,
} from "@slicemachine/core/build/node-utils/paths";
import * as IO from "../../../../lib/io";
import generateLibrariesIndex from "../common/hooks/updateLibraries";
import { BackendEnvironment } from "../../../../lib/models/common/Environment";

interface RenameSliceBody {
  sliceId: string;
  newSliceName: string;
  libName: string;
}

export function renameSlice(req: {
  body: RenameSliceBody;
  env: BackendEnvironment;
}) {
  const { env } = req;
  const { sliceId, newSliceName, libName } = req.body;

  if (!env.manifest.libraries) {
    const message = `[renameSlice] When renaming slice: ${sliceId}, there were no libraries configured in your SM.json.`;
    console.error(message);
    return {
      err: new Error(message),
      status: 500,
      reason: message,
    };
  }
  const libraries = Libraries.libraries(env.cwd, env.manifest.libraries);
  const targetLibrary = libraries.find((library) => library.name === libName);
  if (!targetLibrary) {
    const message = `[renameSlice] When renaming slice: ${sliceId}, the library: ${libName} was not found.`;
    console.error(message);
    return {
      err: new Error(message),
      status: 500,
      reason: message,
    };
  }
  const targetSlice = targetLibrary.components.find(
    (component) => component.model.id === sliceId
  );

  if (!targetSlice) {
    const message = `[renameSlice] When renaming slice: ${sliceId}, the slice: ${sliceId} was not found.`;
    console.error(message);
    return {
      err: new Error(message),
      status: 500,
      reason: message,
    };
  }

  const sliceDirectory = CustomPaths(env.cwd)
    .library(libName)
    .slice(targetSlice.model.name);

  const generatedSliceDirectory = GeneratedPaths(env.cwd)
    .library(libName)
    .slice(targetSlice.model.name);

  IO.Slice.renameSlice(sliceDirectory.model(), newSliceName);

  fs.renameSync(
    sliceDirectory.value(),
    path.join(CustomPaths(env.cwd).library(libName).value(), newSliceName)
  );

  const newPathToSliceDirectory = GeneratedPaths(env.cwd)
    .library(libName)
    .slice(newSliceName);

  fs.renameSync(
    generatedSliceDirectory.value(),
    newPathToSliceDirectory.value()
  );

  if (fs.existsSync(newPathToSliceDirectory.stories())) {
    const prevString = fs.readFileSync(
      newPathToSliceDirectory.stories(),
      "utf-8"
    );
    fs.writeFileSync(
      newPathToSliceDirectory.stories(),
      prevString.replace(new RegExp(targetSlice.model.name, "g"), newSliceName)
    );
  }

  IO.Types.upsert(env);

  generateLibrariesIndex(env, libName);

  return targetSlice;
}
