import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    // TODO: Replace with your project ID and dataset
    projectId: 'blia7jr1',
    dataset: 'production',
  },
  studioHost: 'recursive-taxonomy-examples',
})
