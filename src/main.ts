import * as fs from 'fs';
import dotenv from "dotenv";
import { Client } from '@notionhq/client';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });

fs.mkdir('.notion', (resp) => {
    console.log("Writing files to .notion")
})

notion.blocks.children.list({block_id: '10d87f475d79800d88f5fc65da2df06b'}).then( (res) => {
    fs.writeFile('.notion/root.json', JSON.stringify(res), (err) => {
        for (let page of res.results) {
            console.log("Fetching", page.id)
            notion.blocks.children.list({block_id: page.id}).then( (res) => {
                fs.writeFile(`.notion/${page.id}.json`, JSON.stringify(res), (err) => {
                    if (err) {
                        console.log("Error writing", page.id, err)
                    } else {
                        console.log("Wrote", page.id)
                    }
                })
            })
            
        }    
    });
});
