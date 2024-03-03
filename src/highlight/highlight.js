export const highlightCards = (id_list) => {
    id_list.forEach(id => {
        const id_name = "card" + "id"
        const TSCard = document.getElementById(id_name)
        const class_list = TSCard.classList
        class_list.append("opacity-100")
    })


}

export const deHightLigtCards = (id_list) => {

}


export const highlightNodes = (id_list) => {

}

export const deHightLigtNodes = (id_list) => {

}

export const highlightLinks = (link_list) => {

}

export const deHightLigtLinks = (link_list) => {

}




