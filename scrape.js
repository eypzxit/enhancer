import axios from 'axios'
import FormData from 'form-data'
// Removed file system imports (writeFileSync, unlinkSync) as they are no longer needed.

const Keyy = "-mY6Nh3EWwV1JihHxpZEGV1hTxe2M_zDyT0i8WNeDV4buW9l02UteD6ZZrlAIO0qf6NhYA"

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Core function to handle image upload, enhancement request, and polling for results.
 * FIX: The extraneous outer 'try' block has been removed to fix the SyntaxError.
 */
async function processImage(buffer) {

  // All logic runs outside of an unnecessary outer try block. Exceptions will propagate.
  const form = new FormData()
  // Append the buffer directly with filename and explicit content type.
  form.append("file", buffer, {
      filename: 'image.jpg',
      contentType: 'image/jpeg'
  })

  // --- 1. Upload the image ---
  const uploadRes = await axios.post(
    "https://reaimagine.zipoapps.com/enhance/autoenhance/",
    form,
    {
      headers: {
        ...form.getHeaders(),
        Authorization: Keyy,
        "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 10; Redmi Note 5 Pro Build/QQ3A.2008>
      },
    }
  )

  const name = uploadRes.headers["name"] || uploadRes.data?.name
  if (!name) throw new Error("Failed to retrieve 'name' from upload response")

  let attempts = 0
  const maxAttempts = 20

  // --- 2. Poll for the enhanced result ---
  while (attempts < maxAttempts) {
    attempts++
    try {
      // Use inner try/catch to safely handle temporary network errors during polling
      const res = await axios.post(
        "https://reaimagine.zipoapps.com/enhance/request_res/",
        null,
        {
          headers: {
            name,
            app: "enhanceit",
            ad: "0",
            Authorization: Keyy,
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 10; Redmi Note 5 Pro Build/QQ3A.>
          },
          responseType: "arraybuffer",
          validateStatus: () => true, // Accept non-200 codes to check for readiness
        }
      )

      // Check if the result is ready (status 200 with data)
      if (res.status === 200 && res.data && res.data.length > 0) {
        return Buffer.from(res.data)
      }
    } catch (e) {
        // Ignore polling errors and try again
    }

    await sleep(5000) // Wait 5 seconds before the next poll
  }

  // If the loop finishes without returning, throw the final error.
  throw new Error("Failed to get result after multiple attempts.")
}

/**
 * Scrape function to enhance an image
 * @param {Buffer} buffer - Image buffer received from the server's upload handler
 * @returns {Promise<Buffer>} - Enhanced image buffer
 */
export async function scrape(buffer) {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error("Invalid image buffer")
  }

  return await processImage(buffer)
}
