export function convertNumberInd(phone: string): string {
    let cleaned = phone.replace(/\D/g, '')

    if (cleaned.startsWith('0')) {
        cleaned = '62' + cleaned.substring(1)
    } else if (cleaned.startsWith('62')) {
        return cleaned
    } else {
        cleaned = '62' + cleaned
    }

    return cleaned
}

export function toWhatsAppJid(phone: string): string {
    // if exsists @s.whatsapp.net or @g.us, return as is
    if (phone.endsWith('@s.whatsapp.net') || phone.endsWith('@g.us')) {
        return phone
    }

    // if starts with 0, replace with 62 and add @s.whatsapp.net
    const normalized = convertNumberInd(phone)
    return `${normalized}@s.whatsapp.net`
}
