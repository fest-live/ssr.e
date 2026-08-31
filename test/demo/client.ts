/*
 * Filename: client.ts
 * FullPath: modules/projects/ssr.e/test/demo/client.ts
 * FIND:ssre
 *
 * Client half of the shared `ssre` namespace. Optional lure: ssre.use({ bindWith }).
 */
import { ssre, stringRef } from "../../src/index.ts";

ssre.client.set("accent", stringRef("from client"));
