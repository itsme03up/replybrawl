#!/usr/bin/env python3
# convert_badwords.py
# テキストファイルの悪口リストをJSONに変換し、強さレベルを付与するスクリプト

import json
import os
import random

def convert_badwords_to_json(input_file, output_file):
    """
    悪口テキストファイルをJSONに変換
    各悪口に強さレベル（1-3）とダメージ値を付与
    """
    if not os.path.exists(input_file):
        print(f"入力ファイルが見つかりません: {input_file}")
        return
    
    badwords = []
    
    with open(input_file, 'r', encoding='utf-8') as f:
        for line in f:
            word = line.strip()
            if word and not word.startswith('#'):  # 空行とコメント行をスキップ
                # 文字数に基づいて強さを決定（適当な基準）
                length = len(word)
                if length <= 3:
                    strength = 1
                    damage = random.randint(10, 20)
                    block_risk = 0.1
                elif length <= 6:
                    strength = 2
                    damage = random.randint(20, 35)
                    block_risk = 0.3
                else:
                    strength = 3
                    damage = random.randint(30, 50)
                    block_risk = 0.5
                
                badwords.append({
                    "word": word,
                    "strength": strength,
                    "damage": damage,
                    "blockRisk": block_risk
                })
    
    # 強さ別にソート
    badwords.sort(key=lambda x: x['strength'])
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(badwords, f, ensure_ascii=False, indent=2)
    
    print(f"変換完了: {len(badwords)}個の悪口を {output_file} に保存しました")

def main():
    # 入力ファイルと出力ファイルのパス
    src_dir = os.path.join(os.path.dirname(__file__), '..', 'src', 'data')
    
    # 日本語の悪口ファイルを変換
    ja_input = os.path.join(src_dir, 'badwords_ja.txt')
    ja_output = os.path.join(src_dir, 'badwords_ja.json')
    
    if os.path.exists(ja_input):
        convert_badwords_to_json(ja_input, ja_output)
    
    # ロシア語の悪口ファイルも変換
    ru_input = os.path.join(src_dir, 'badwords_ru.txt')
    ru_output = os.path.join(src_dir, 'badwords_ru.json')
    
    if os.path.exists(ru_input):
        convert_badwords_to_json(ru_input, ru_output)

if __name__ == "__main__":
    main()
