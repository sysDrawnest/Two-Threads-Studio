/**
 * convert-to-webp.js
 * Selectively converts PNG/JPEG assets to WebP.
 * - Preserves alpha for images that have transparency (channels=4)
 * - Uses quality=82 for photography (below-fold), quality=85 for above-fold LCP images
 * - Does NOT delete originals (component imports updated separately)
 * - Skips: logo, wave-haikei (too small), video, duplicates
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const assetsDir = path.resolve(__dirname, '..', 'src/assets');
const stitchDir = path.join(assetsDir, 'stitch');

// [source, quality, note]
const conversions = [
  // Root assets — high priority LCP / above-fold
  ['hero section mobile.png',                                          85, 'LCP mobile hero — alpha preserved'],
  ['hero section pc.png',                                              85, 'LCP desktop hero — alpha preserved'],
  // Root assets — below fold, photography
  ['1F78D49-EC80-4B90-A90F-D848BECFD893.png',                         82, 'Portrait cutout Template3/CMS — alpha preserved'],
  ['botanical e\u2026_202607141252.png',                              82, 'Featured collection image'],
  ['Temple_relief_with_floral_mandalas_202607141319.jpeg',            82, 'Sacred Traditions image'],
  ['Embroidery_collection_flat_lay_2K_202607141328.jpeg',             82, 'Embroidery flat lay'],
  ['Woman_wearing_crochet_jacket_2K_202608051414-Recovered.png',      82, 'Crochet cutout — alpha preserved'],
  ['Image for cutum section Jul 11, 2026, 05_05_41 PM.png',          82, 'Custom Creations section'],
  ['Woman_carrying_wool_handbag_2K_202607141446.jpeg',                82, 'Handbag 1'],
  ['Woman_holding_wool_handbag_2K_202607141448.jpeg',                 82, 'Handbag 2'],
  ['Embroidery_hoop,_pencil,_thread_2K_202607100702.jpeg',            82, 'Embroidery hoop'],
  ['our_story_section.png',                                            82, 'Our Story section image — alpha preserved'],
  ['Authentication page pc .jpeg',                                    82, 'Auth page desktop bg'],
  ['Authentication page mobile.jpeg',                                  82, 'Auth page mobile bg'],
  ['portrait_of_personalized_portraits_for_a_luxur.png',             82, 'Collection portrait'],
  ['portrait_of_a_heritage_collection_for_a_luxury.png',             82, 'Collection portrait'],
  ['portrait_of_a_modern_minimal_collection_for_a_luxury.png',       82, 'Collection portrait'],
  ['portrait_of_wedding_keepsakes_for_a_luxury_em.png',              82, 'Collection portrait'],
  ['portrait_of_seasonal_editions_for_a_luxury_em.png',              82, 'Collection portrait'],
  ['portrait_of_a_botanical_collection_for_a_luxur.png',             82, 'Collection portrait'],
  ['shop_banner_artisan_craft.png',                                    82, 'Shop banner'],
  ['Handcrafted_embroidery_in_artisa\u2026_2K_202607291522.jpeg',     82, 'Shop banner'],
  // stitch sub-directory
  ['stitch/a_beautifully_finished_embroidery_piece_displayed_in_a_wooden_hoop_featuring_an.png', 82, 'Gallery/CustomCreations'],
  ['stitch/a_close_up_shot_of_a_cozy_organized_creative_workspace_for_embroidery_featuring.png', 82, 'Gallery'],
  ['stitch/a_detail_shot_of_embroidered_wildflowers_on_unbleached_linen_soft_pastels_and.png',   82, 'Gallery'],
  ['stitch/a_high_end_editorial_photo_of_a_finished_hand_embroidery_piece_on_unbleached.png',    82, 'Gallery'],
  ['stitch/an_artistic_flat_lay_of_embroidery_materials_linen_fabric_sharp_vintage.png',         82, 'Gallery/CustomCreations'],
  ['stitch/close_up_of_a_person_s_hands_delicately_working_on_a_hoop_embroidery_project.png',   82, 'Gallery'],
  ['stitch/close_up_of_warm_toned_natural_flax_linen_fabric_and_embroidery_thread_soft.png',    82, 'Gallery'],
  ['stitch/community_gallery_twothreads_studio.png',                                              82, 'Gallery'],
  ['stitch/close_up_of_high_quality_unbleached_linen_fabric_texture_natural_beige_tones.png',   82, 'OurStory'],
  ['stitch/hand_drawn_embroidery_patterns_and_sketches_on_paper_charcoal_pencil_artistic.png',  82, 'OurStory/CustomCreations'],
  ['stitch/close_up_of_hands_carefully_packing_an_embroidery_kit_with_recycled_paper_and.png',  82, 'OurStory'],
  ['stitch/a_high_end_editorial_photo_of_a_cozy_bedroom_featuring_an_embroidered.png',          82, 'Unused/possible future'],
  ['stitch/a_high_end_editorial_photo_of_a_minimalist_living_room_featuring_framed_hand.png',   82, 'Unused/possible future'],
  ['stitch/a_high_end_editorial_photo_of_a_serene_bathroom_setting_featuring_delicate.png',     82, 'Unused/possible future'],
];

async function convert(src, quality, note) {
  const srcPath = path.join(assetsDir, src);
  const destPath = path.join(assetsDir, src.replace(/\.(png|jpe?g)$/i, '.webp'));

  if (!fs.existsSync(srcPath)) {
    console.log(`SKIP (not found): ${src}`);
    return;
  }
  if (fs.existsSync(destPath)) {
    console.log(`SKIP (already exists): ${src.replace(/\.(png|jpe?g)$/i, '.webp')}`);
    return;
  }

  try {
    const beforeBytes = fs.statSync(srcPath).size;
    await sharp(srcPath)
      .webp({ quality, effort: 4 })
      .toFile(destPath);
    const afterBytes = fs.statSync(destPath).size;
    const saving = (((beforeBytes - afterBytes) / beforeBytes) * 100).toFixed(1);
    console.log(`OK  ${src} → .webp  ${(beforeBytes/1024/1024).toFixed(2)}MB → ${(afterBytes/1024/1024).toFixed(2)}MB  (-${saving}%)  [${note}]`);
  } catch (e) {
    console.error(`ERR ${src}: ${e.message}`);
  }
}

async function main() {
  console.log('Starting WebP conversion...\n');
  for (const [src, quality, note] of conversions) {
    await convert(src, quality, note);
  }
  console.log('\nDone.');
}

main().catch(console.error);
