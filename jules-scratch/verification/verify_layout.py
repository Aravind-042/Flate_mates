from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1920, 'height': 1080})
    page = context.new_page()

    page.goto("http://127.0.0.1:8080/create-listing")

    expect(page).to_have_url("http://127.0.0.1:8080/create-listing")

    # Wait for the form to be visible by looking for the live preview title
    expect(page.get_by_text("Live Preview")).to_be_visible(timeout=10000) # 10s timeout

    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
