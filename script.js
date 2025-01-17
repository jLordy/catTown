// function to get each tab details
const tabs = document.querySelectorAll('[data-tab-value]')
const tabInfos = document.querySelectorAll('[data-tab-info]')

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = document
      .querySelector(tab.dataset.tabValue);
    tabInfos.forEach(tabInfo => {
      tabInfo.classList.remove('active')
    })
    target.classList.add('active');
  })
})
let ethPriceUSD = 0;
let ethPricePHP = 0;
let kibblePriceUSD = 0;
let kibblePricePHP = 0;

async function fetchCryptoPrices() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,kibble&vs_currencies=usd,php');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        ethPriceUSD = data.ethereum.usd;
        ethPricePHP = data.ethereum.php;
        kibblePriceUSD = data.kibble.usd;
        kibblePricePHP = data.kibble.php;

        document.getElementById('eth-price-usd').innerText = `ETH Price (USD): ${ethPriceUSD}`;
        document.getElementById('eth-price-php').innerText = `ETH Price (PHP): ${ethPricePHP}`;
        document.getElementById('kibble-price-usd').innerText = `Kibble Price (USD): ${kibblePriceUSD}`;
        document.getElementById('kibble-price-php').innerText = `Kibble Price (PHP): ${kibblePricePHP}`;
        
        convertCurrency();
    } catch (error) {
        console.error('Fetching crypto prices failed:', error);
        document.getElementById('eth-price-usd').innerText = 'ETH Price (USD): Error';
        document.getElementById('eth-price-php').innerText = 'ETH Price (PHP): Error';
        document.getElementById('kibble-price-usd').innerText = 'Kibble Price (USD): Error';
        document.getElementById('kibble-price-php').innerText = 'Kibble Price (PHP): Error';
    }
}

function convertCurrency() {
    const crypto = document.getElementById('crypto-select').value;
    const currency = document.getElementById('currency-select').value;
    let amount = parseFloat(document.getElementById('crypto-amount').value);
    let convertedAmount = parseFloat(document.getElementById('converted-amount').value);
    
    if (isNaN(amount)) amount = 0;
    if (isNaN(convertedAmount)) convertedAmount = 0;
    
    let resultAmount = 0;
    
    if (crypto === 'eth' && currency === 'usd') {
        resultAmount = amount * ethPriceUSD;
    } else if (crypto === 'eth' && currency === 'php') {
        resultAmount = amount * ethPricePHP;
    } else if (crypto === 'kibble' && currency === 'usd') {
        resultAmount = amount * kibblePriceUSD;
    } else if (crypto === 'kibble' && currency === 'php') {
        resultAmount = amount * kibblePricePHP;
    }
    
    if (!isNaN(resultAmount)) {
        document.getElementById('converted-amount').value = resultAmount.toFixed(4);
    } else {
        document.getElementById('converted-amount').value = '';
    }
}

// Fetch prices on page load
fetchCryptoPrices();

// Add event listeners for input changes
document.getElementById('crypto-select').addEventListener('change', convertCurrency);
document.getElementById('currency-select').addEventListener('change', convertCurrency);
document.getElementById('crypto-amount').addEventListener('input', convertCurrency);
document.getElementById('converted-amount').addEventListener('input', convertBackToCrypto);

function convertBackToCrypto() {
    const crypto = document.getElementById('crypto-select').value;
    const currency = document.getElementById('currency-select').value;
    let convertedAmount = parseFloat(document.getElementById('converted-amount').value);
    
    if (isNaN(convertedAmount)) convertedAmount = 0;
    
    let resultAmount = 0;
    
    if (crypto === 'eth' && currency === 'usd') {
        resultAmount = convertedAmount / ethPriceUSD;
    } else if (crypto === 'eth' && currency === 'php') {
        resultAmount = convertedAmount / ethPricePHP;
    } else if (crypto === 'kibble' && currency === 'usd') {
        resultAmount = convertedAmount / kibblePriceUSD;
    } else if (crypto === 'kibble' && currency === 'php') {
        resultAmount = convertedAmount / kibblePricePHP;
    }
    
    if (!isNaN(resultAmount)) {
        document.getElementById('crypto-amount').value = resultAmount.toFixed(4);
    } else {
        document.getElementById('crypto-amount').value = '';
    }
}



document.addEventListener('DOMContentLoaded', () => {
    const catAmountInput = document.getElementById('cat-amount');
    const catConvertedAmountInput = document.getElementById('cat-converted-amount');

    // Conversion rate
    const CAT_TO_ETH_RATE = 0.00007; // 1 Cat = 0.00007 ETH

    async function fetchEthToPhpRate() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=php');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            console.log('ETH to PHP rate fetched:', data.ethereum.php); // Debug log
            return data.ethereum.php;
        } catch (error) {
            console.error('Error fetching ETH to PHP rate:', error);
            return null;
        }
    }

    async function handleCatAmountInput() {
        const catAmount = parseFloat(catAmountInput.value);
        console.log('Cat amount input:', catAmount); // Debug log
        if (!isNaN(catAmount)) {
            const ethToPhpRate = await fetchEthToPhpRate();
            if (ethToPhpRate !== null) {
                const ethAmount = catAmount * CAT_TO_ETH_RATE;
                const phpAmount = ethAmount * ethToPhpRate;
                catConvertedAmountInput.value = phpAmount.toFixed(2);
                console.log('Converted PHP amount:', phpAmount); // Debug log
            } else {
                catConvertedAmountInput.value = 'Error fetching rate';
            }
        } else {
            catConvertedAmountInput.value = '';
        }
    }

    async function handlePhpAmountInput() {
        const phpAmount = parseFloat(catConvertedAmountInput.value);
        console.log('PHP amount input:', phpAmount); // Debug log
        if (!isNaN(phpAmount)) {
            const ethToPhpRate = await fetchEthToPhpRate();
            if (ethToPhpRate !== null) {
                const ethAmount = phpAmount / ethToPhpRate;
                const catAmount = ethAmount / CAT_TO_ETH_RATE;
                catAmountInput.value = catAmount.toFixed(2);
                console.log('Converted Cat amount:', catAmount); // Debug log
            } else {
                catAmountInput.value = 'Error fetching rate';
            }
        } else {
            catAmountInput.value = '';
        }
    }

    catAmountInput.addEventListener('input', handleCatAmountInput);
    catConvertedAmountInput.addEventListener('input', handlePhpAmountInput);
});