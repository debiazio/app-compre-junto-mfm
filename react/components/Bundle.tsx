import React from "react"
import { useProduct } from "vtex.product-context"
import { useQuery } from "react-apollo"
import INSTALLMENTS_QUERY from "../graphql/getAccessories.graphql"

// estilos inline
const styles: Record<string, React.CSSProperties> = {
  parcelasCustom: {
    fontSize: "2.2vh",
    color: "#FEBBCE",
    margin: "0"
  },
}

function InstallmentsInfo() {
  const productContext = useProduct()
  const slug = productContext?.product?.linkText

  const { data, loading, error } = useQuery(INSTALLMENTS_QUERY, {
    variables: { slug },
    skip: !slug,
  })

  if (loading) return <p>Carregando...</p>
  if (error) return <p>Erro ao carregar parcelas</p>

  const installments =
    data?.product?.items?.[0]?.sellers?.[0]?.commertialOffer?.Installments ?? []

  if (!installments.length) return null

  // pega o maior número de parcelas
  const maxInstallment = installments.reduce((prev: any, curr: any) =>
    curr.NumberOfInstallments > prev.NumberOfInstallments ? curr : prev
  )

  return (
    <p className="parcelas-custom" style={styles.parcelasCustom}>
      {maxInstallment.NumberOfInstallments}x de{" "}
      {maxInstallment.Value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })} com juros no cartão
    </p>
  )
}

export default InstallmentsInfo
