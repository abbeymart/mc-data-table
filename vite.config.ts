import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
    build  : {
        lib          : {
            entry: resolve(__dirname, "src/index.ts"),
            name : "mc-data-table",
            // fileName: (format) => `${format}.js`,
        },
        rollupOptions: {
            // externalise required libraries/packages
            external: ["vue", "w3-css"],
            output  : {
                // global variables to be used in UMD for external dependencies
                globals: {
                    vue: "Vue",
                }
            }
        }
    },
    plugins: [
        vue(),
        dts({
            insertTypesEntry: true,
        }),
    ],
})
