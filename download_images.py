"""
DELY Sejarah Dunia — Image Downloader
======================================
Jalankan script ini SATU KALI di komputer kamu untuk mengunduh
semua gambar ke folder assets/img/ secara lokal.

Cara pakai:
  1. Pastikan Python 3 sudah terinstall
  2. Buka terminal / command prompt
  3. cd ke folder dely-politik/
  4. Jalankan: python download_images.py
  5. Tunggu sampai selesai (biasanya 1-2 menit)
  6. Upload seluruh folder ke GitHub seperti biasa

Setelah download selesai, index.html sudah diupdate otomatis
untuk menggunakan gambar lokal — tidak perlu edit manual apapun.
"""

import urllib.request
import os
import sys
import time

# ── Daftar semua gambar ─────────────────────────────────────────
IMAGES = [
    # Peradaban
    ("colosseum.jpg",        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/1280px-Colosseo_2020.jpg"),
    ("colosseum_sm.jpg",     "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/800px-Colosseo_2020.jpg"),
    ("persepolis.jpg",       "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Persepolis_Apadana_east_stairs.jpg/1280px-Persepolis_Apadana_east_stairs.jpg"),
    ("persepolis_sm.jpg",    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Persepolis_Apadana_east_stairs.jpg/800px-Persepolis_Apadana_east_stairs.jpg"),
    ("genghis_khan.jpg",     "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Genghis_Khan_on_horse.jpg/800px-Genghis_Khan_on_horse.jpg"),
    ("genghis_khan_sm.jpg",  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Genghis_Khan_on_horse.jpg/600px-Genghis_Khan_on_horse.jpg"),
    ("mir_arab.jpg",         "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Mir-i-Arab_Madrasah_Bukhara.jpg/1280px-Mir-i-Arab_Madrasah_Bukhara.jpg"),
    ("mir_arab_sm.jpg",      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Mir-i-Arab_Madrasah_Bukhara.jpg/800px-Mir-i-Arab_Madrasah_Bukhara.jpg"),
    ("muaro_jambi.jpg",      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Muaro_Jambi_Temple.jpg/1280px-Muaro_Jambi_Temple.jpg"),
    ("muaro_jambi_sm.jpg",   "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Muaro_Jambi_Temple.jpg/800px-Muaro_Jambi_Temple.jpg"),
    ("dday.jpg",             "https://upload.wikimedia.org/wikipedia/commons/a/a5/Into_the_Jaws_of_Death_23-0455M_edit.jpg"),
    ("topkapi.jpg",          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Topkapi_palace_dsc04786.jpg/1280px-Topkapi_palace_dsc04786.jpg"),
    ("topkapi_sm.jpg",       "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Topkapi_palace_dsc04786.jpg/800px-Topkapi_palace_dsc04786.jpg"),
    ("chichen_itza.jpg",     "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Chichen_Itza_3.jpg/1280px-Chichen_Itza_3.jpg"),
    ("chichen_itza_sm.jpg",  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Chichen_Itza_3.jpg/800px-Chichen_Itza_3.jpg"),
    ("great_wall.jpg",       "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/20090529_great_wall_8185.jpg/1280px-20090529_great_wall_8185.jpg"),
    ("great_wall_sm.jpg",    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/20090529_great_wall_8185.jpg/800px-20090529_great_wall_8185.jpg"),
    # Perang
    ("ww1_trench.jpg",       "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Cheshire_Regiment_trench_Somme_1916.jpg/1280px-Cheshire_Regiment_trench_Somme_1916.jpg"),
    ("ww1_trench_sm.jpg",    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Cheshire_Regiment_trench_Somme_1916.jpg/800px-Cheshire_Regiment_trench_Somme_1916.jpg"),
    ("eastern_front.jpg",    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Bundesarchiv_Bild_101I-218-0504-36%2C_Russland-Mitte%2C_Soldat_mit_Panzerfaust.jpg/644px-Bundesarchiv_Bild_101I-218-0504-36%2C_Russland-Mitte%2C_Soldat_mit_Panzerfaust.jpg"),
    ("eastern_front_sm.jpg", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Bundesarchiv_Bild_101I-218-0504-36%2C_Russland-Mitte%2C_Soldat_mit_Panzerfaust.jpg/600px-Bundesarchiv_Bild_101I-218-0504-36%2C_Russland-Mitte%2C_Soldat_mit_Panzerfaust.jpg"),
    ("hagia_sophia.jpg",     "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Hagia_Sophia_Mars_2013.jpg/800px-Hagia_Sophia_Mars_2013.jpg"),
    ("roman_forum.jpg",      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Roman_Forum_-_Before_Imperial_Fora.jpg/800px-Roman_Forum_-_Before_Imperial_Fora.jpg"),
    ("caesar.jpg",           "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/GaiusJuliusCaesar.jpg/600px-GaiusJuliusCaesar.jpg"),
    # Blueprint
    ("spitfire.jpg",         "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Spitfire_silhouette.jpg/800px-Spitfire_silhouette.jpg"),
    ("tiger_tank.jpg",       "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/PzKpfwVI_tiger_bovington.jpg/800px-PzKpfwVI_tiger_bovington.jpg"),
    ("ballista.jpg",         "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Ballista_Diagram.jpg/800px-Ballista_Diagram.jpg"),
    ("mongol_bow.jpg",       "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Mongol_recurve_bow.jpg/800px-Mongol_recurve_bow.jpg"),
    ("yamato.jpg",           "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Yamato_under_air_attack_1945.jpg/800px-Yamato_under_air_attack_1945.jpg"),
    ("shamshir.jpg",         "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Shamshir_Sword.jpg/800px-Shamshir_Sword.jpg"),
]

# ── Mapping URL lama → path lokal ──────────────────────────────
URL_TO_LOCAL = {
    # Colosseum
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/1280px-Colosseo_2020.jpg":   "assets/img/colosseum.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/800px-Colosseo_2020.jpg":    "assets/img/colosseum_sm.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/400px-Colosseo_2020.jpg":    "assets/img/colosseum_sm.jpg",
    # Persepolis
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Persepolis_Apadana_east_stairs.jpg/1280px-Persepolis_Apadana_east_stairs.jpg": "assets/img/persepolis.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Persepolis_Apadana_east_stairs.jpg/800px-Persepolis_Apadana_east_stairs.jpg":  "assets/img/persepolis_sm.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Persepolis_Apadana_east_stairs.jpg/400px-Persepolis_Apadana_east_stairs.jpg":  "assets/img/persepolis_sm.jpg",
    # Genghis Khan
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Genghis_Khan_on_horse.jpg/800px-Genghis_Khan_on_horse.jpg": "assets/img/genghis_khan.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Genghis_Khan_on_horse.jpg/600px-Genghis_Khan_on_horse.jpg": "assets/img/genghis_khan_sm.jpg",
    # Mir Arab Madrasah
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Mir-i-Arab_Madrasah_Bukhara.jpg/1280px-Mir-i-Arab_Madrasah_Bukhara.jpg": "assets/img/mir_arab.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Mir-i-Arab_Madrasah_Bukhara.jpg/800px-Mir-i-Arab_Madrasah_Bukhara.jpg":  "assets/img/mir_arab_sm.jpg",
    # Muaro Jambi
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Muaro_Jambi_Temple.jpg/1280px-Muaro_Jambi_Temple.jpg": "assets/img/muaro_jambi.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Muaro_Jambi_Temple.jpg/800px-Muaro_Jambi_Temple.jpg":  "assets/img/muaro_jambi_sm.jpg",
    # D-Day
    "https://upload.wikimedia.org/wikipedia/commons/a/a5/Into_the_Jaws_of_Death_23-0455M_edit.jpg": "assets/img/dday.jpg",
    # Topkapi
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Topkapi_palace_dsc04786.jpg/1280px-Topkapi_palace_dsc04786.jpg": "assets/img/topkapi.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Topkapi_palace_dsc04786.jpg/800px-Topkapi_palace_dsc04786.jpg":  "assets/img/topkapi_sm.jpg",
    # Chichen Itza
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Chichen_Itza_3.jpg/1280px-Chichen_Itza_3.jpg": "assets/img/chichen_itza.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Chichen_Itza_3.jpg/800px-Chichen_Itza_3.jpg":  "assets/img/chichen_itza_sm.jpg",
    # Great Wall
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/20090529_great_wall_8185.jpg/1280px-20090529_great_wall_8185.jpg": "assets/img/great_wall.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/20090529_great_wall_8185.jpg/800px-20090529_great_wall_8185.jpg":  "assets/img/great_wall_sm.jpg",
    # WW1 Trench
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Cheshire_Regiment_trench_Somme_1916.jpg/1280px-Cheshire_Regiment_trench_Somme_1916.jpg": "assets/img/ww1_trench.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Cheshire_Regiment_trench_Somme_1916.jpg/800px-Cheshire_Regiment_trench_Somme_1916.jpg":  "assets/img/ww1_trench_sm.jpg",
    # Eastern Front WW2
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Bundesarchiv_Bild_101I-218-0504-36%2C_Russland-Mitte%2C_Soldat_mit_Panzerfaust.jpg/644px-Bundesarchiv_Bild_101I-218-0504-36%2C_Russland-Mitte%2C_Soldat_mit_Panzerfaust.jpg": "assets/img/eastern_front.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Bundesarchiv_Bild_101I-218-0504-36%2C_Russland-Mitte%2C_Soldat_mit_Panzerfaust.jpg/600px-Bundesarchiv_Bild_101I-218-0504-36%2C_Russland-Mitte%2C_Soldat_mit_Panzerfaust.jpg": "assets/img/eastern_front_sm.jpg",
    # Hagia Sophia
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Hagia_Sophia_Mars_2013.jpg/800px-Hagia_Sophia_Mars_2013.jpg": "assets/img/hagia_sophia.jpg",
    # Roman Forum
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Roman_Forum_-_Before_Imperial_Fora.jpg/800px-Roman_Forum_-_Before_Imperial_Fora.jpg": "assets/img/roman_forum.jpg",
    # Caesar
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/GaiusJuliusCaesar.jpg/600px-GaiusJuliusCaesar.jpg": "assets/img/caesar.jpg",
    # Blueprint
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Supermarine_Spitfire_Mk_Ia_%283-view_silhouette%29.svg/1200px-Supermarine_Spitfire_Mk_Ia_%283-view_silhouette%29.svg.png": "assets/img/spitfire.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/PzKpfwVI_tiger_bovington.jpg/800px-PzKpfwVI_tiger_bovington.jpg": "assets/img/tiger_tank.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Ballista_Diagram.jpg/800px-Ballista_Diagram.jpg":  "assets/img/ballista.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Mongol_recurve_bow.jpg/800px-Mongol_recurve_bow.jpg": "assets/img/mongol_bow.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Yamato_under_air_attack_1945.jpg/800px-Yamato_under_air_attack_1945.jpg": "assets/img/yamato.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Shamshir_Sword.jpg/800px-Shamshir_Sword.jpg": "assets/img/shamshir.jpg",
}

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Referer': 'https://en.wikipedia.org/'
}

def download_images():
    os.makedirs("assets/img", exist_ok=True)
    total = len(IMAGES)
    ok = 0
    fail = 0

    print(f"\n📥 Mengunduh {total} gambar ke assets/img/\n")

    for i, (filename, url) in enumerate(IMAGES, 1):
        dest = os.path.join("assets", "img", filename)

        # Skip kalau sudah ada dan ukurannya wajar
        if os.path.exists(dest) and os.path.getsize(dest) > 5000:
            print(f"  ⏭  [{i:02d}/{total}] {filename} (sudah ada, skip)")
            ok += 1
            continue

        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = resp.read()
            with open(dest, 'wb') as f:
                f.write(data)
            size_kb = len(data) // 1024
            print(f"  ✅ [{i:02d}/{total}] {filename} ({size_kb} KB)")
            ok += 1
            time.sleep(0.3)  # Jangan terlalu cepat biar tidak diblokir
        except Exception as e:
            print(f"  ❌ [{i:02d}/{total}] {filename} — GAGAL: {e}")
            fail += 1

    print(f"\n{'='*50}")
    print(f"  Selesai: {ok} berhasil, {fail} gagal")

    if fail > 0:
        print(f"\n  ⚠️  {fail} gambar gagal diunduh.")
        print("  Coba jalankan script ini lagi — biasanya berhasil di percobaan kedua.")
    else:
        print("\n  🎉 Semua gambar berhasil diunduh!")

    return fail == 0


def patch_html():
    """Update index.html — ganti semua URL Wikimedia ke path lokal"""
    html_path = "index.html"
    if not os.path.exists(html_path):
        print(f"\n⚠️  {html_path} tidak ditemukan. Jalankan script ini dari folder dely-politik/")
        return False

    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    replaced = 0
    for url, local in URL_TO_LOCAL.items():
        if url in content:
            content = content.replace(url, local)
            replaced += 1

    if replaced == 0:
        print("\nℹ️  HTML sudah menggunakan path lokal — tidak ada yang perlu diubah.")
        return True

    # Backup dulu
    with open(html_path + '.bak', 'w', encoding='utf-8') as f:
        f.write(original)

    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"\n✅ index.html diperbarui — {replaced} URL diganti ke path lokal.")
    print("   (Backup disimpan di index.html.bak)")
    return True


if __name__ == '__main__':
    # Pastikan script dijalankan dari folder dely-politik/
    if not os.path.exists("index.html"):
        print("❌ ERROR: Jalankan script ini dari dalam folder dely-politik/")
        print("   Contoh: cd dely-politik && python download_images.py")
        sys.exit(1)

    success = download_images()
    if success:
        patch_html()
        print("\n✅ SELESAI! Upload seluruh folder ke GitHub seperti biasa.")
        print("   Gambar sekarang tersimpan lokal di assets/img/\n")
    else:
        print("\n⚠️  Ada gambar yang gagal. Coba jalankan lagi.")
        patch_html()  # Tetap patch HTML untuk yang berhasil
