using PuppeteerSharp;
using System.Threading.Tasks;

namespace OeboWebApp
{
    public static class PageExtensions
    {
        public static Task<bool> IsVisibleAsync(this Page page, string selector) => page.EvaluateFunctionAsync<bool>($@"() =>
{{
    const el = document.querySelector(`{selector}`);
    if (!el) {{
        return false;
    }}
    const style = window.getComputedStyle(el);
    return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
}}");
        public static Task WaitForSelectorToDisappearAsync(this Page page, string selector) => page.WaitForExpressionAsync($"!document.querySelector(`{selector}`)");
        public static Task SetValueAsync(this Page page, string selector, string value) => page.EvaluateExpressionAsync($"document.querySelector(`{selector}`).value = `{value}`;");
        public static async Task<string> GetInnerTextAsync(this Page page, string selector) => (await page.EvaluateExpressionAsync($"document.querySelector(`{selector}`).innerText")).ToString();
    }
}
