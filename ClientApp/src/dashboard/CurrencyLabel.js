const Symbol = ({ currency }) =>
  /*html*/ `<img class="h-7 w-7 object-contain" src="https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/64/${currency.slug}.png" />`;

export default function CurrencyLabel({ currency }) {
  return /*html*/ `
        <span class="flex items-center gap-2 whitespace-nowrap">
            ${
              currency
                ? /*html*/ `${Symbol({ currency })} ${currency.symbol}`
                : `<i class="gg-dollar" style="--ggs:1"></i>`
            }
        </span>
    `;
}
