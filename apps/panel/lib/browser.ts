// The runner, from the panel's pages in the browser: through
// /runner-api, which checks the session and adds the root token.
import { Runner } from "@zeroko/ui/lib/runner"

export const runner = new Runner("/runner-api")
