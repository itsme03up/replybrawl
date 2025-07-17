#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
悪口リストをテキストファイルからJSONファイルに変換するスクリプト
"""

import json
import os

def convert_txt_to_json(txt_file_path, json_file_path):
    """
    テキストファイルの悪口リストをJSONファイルに変換
    各悪口にダメージレベル（1-3）をランダムに割り当て
    """
    import random
    
    badwords = []
    
    try:
        with open(txt_file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        for line in lines:
            word = line.strip()
            if word and not word.startswith('#'):  # 空行とコメント行をスキップ
                # ダメージレベルを設定（1=軽い, 2=中程度, 3=重い）
                damage_level = random.choice([1, 1, 1, 2, 2, 3])  # 軽いものを多めに
                
                badwords.append({
                    "word": word,
                    "damage": damage_level * 10,  # 10, 20, 30のダメージ
                    "block_risk": damage_level * 0.1  # 0.1, 0.2, 0.3のブロック率
                })
        
        # JSONファイルに保存
        with open(json_file_path, 'w', encoding='utf-8') as f:
            json.dump(badwords, f, ensure_ascii=False, indent=2)
            
        print(f"✅ 変換完了: {txt_file_path} → {json_file_path}")
        print(f"   悪口数: {len(badwords)}個")
        
    except Exception as e:
        print(f"❌ エラー: {e}")

if __name__ == "__main__":
    # 日本語の悪口リストを変換
    script_dir = os.path.dirname(os.path.abspath(__file__))
    src_dir = os.path.join(script_dir, "..", "src", "data")
    
    txt_file = os.path.join(src_dir, "badwords_ja.txt")
    json_file = os.path.join(src_dir, "badwords_ja.json")
    
    if os.path.exists(txt_file):
        convert_txt_to_json(txt_file, json_file)
    else:
        print(f"❌ ファイルが見つかりません: {txt_file}")
        
    # ロシア語版も処理（存在する場合）
    txt_file_ru = os.path.join(src_dir, "badwords_ru.txt")
    json_file_ru = os.path.join(src_dir, "badwords_ru.json")
    
    if os.path.exists(txt_file_ru):
        convert_txt_to_json(txt_file_ru, json_file_ru)