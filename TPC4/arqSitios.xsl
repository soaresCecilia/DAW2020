<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    version="2.0">
    
    
    
    <!-- Página Principal o ficheiro chama-se index.html -->
    <xsl:template match="/">
        <!-- Para que ficheiro quero mandar o atributo -->
        <xsl:result-document href="arqs/index.html">
            <html>
                <head>
                    <title>Arquivo Arqueológico</title>
                </head>
                <body>
                    <h2>Arquivo Arqueológico</h2>
                    <h3>
                        Índice
                    </h3>
                    <ol>
                        <xsl:apply-templates select="//ARQELEM" mode="indice">
                            <xsl:sort select="IDENTI"/>
                        </xsl:apply-templates>                                   
                    </ol>
                </body>
            </html>
        </xsl:result-document>
        <xsl:apply-templates/>
    </xsl:template>
    
    <!-- Templates para o indice desambiguo os templates a partir dos modes.......................................... -->
    
    <xsl:template match="ARQELEM" mode="indice">
        <li>
            <!-- novo conjunto de bookmarks que começam por  para não colidir com as outras -->
            <a name="/{count(preceding-sibling::*)+1}"/>
            <!-- tem de saltar para a página dos doc que vamos gerar-->
            <a href="arq{count(preceding-sibling::*)+1}.html">
                <xsl:value-of select="IDENTI"/>
            </a>
        </li>
    </xsl:template>
    
    
    
    <!-- Templates para o conteúdo.......................................... -->
    
    <xsl:template match="ARQELEM">
        <xsl:result-document href="arqs/arq{count(preceding-sibling::*)+1}.html">
            
            <html>
                <head>
                    <title>
                        <xsl:value-of select="IDENTI"/>
                    </title>
                </head>
                <body>
                    
                    <p><b>Identidade:</b> <xsl:value-of select="IDENTI"/></p>
                    <p><b>Descrição:</b> <xsl:value-of select="DESCRI"/></p>
                    <p><b>Lugar:</b> <xsl:value-of select="LUGAR"/></p>
                    <p><b>Freguesia:</b> <xsl:value-of select="FREGUE"/></p>
                    <p><b>Concelho:</b> <xsl:value-of select="CONCEL"/></p>
                    
                    <p><b>Latitude:</b> <xsl:value-of select="LATITU"/></p>
                    <p><b>Longitude:</b> <xsl:value-of select="LONGIT"/></p>
                    <p><b>Altitude:</b> <xsl:value-of select="ALTITU"/></p>
                    <p><b>Acesso:</b> <xsl:value-of select="ACESSO"/></p>
                    <p><b>Quadro:</b> <xsl:value-of select="QUADRO"/></p>
                    
                    <p><b>Trabalhos Arqueológicos:</b> <xsl:value-of select="TRAARQ"/></p>
                    <p><b>Descrição:</b> <xsl:value-of select="DESARQ"/></p>
                    <p><b>Interpretação do Achado Arqueológico:</b> <xsl:value-of select="INTERP"/></p>
                    <p><b>Depositado:</b> <xsl:value-of select="DEPOSI"/></p>
                    <p><b>Bibliografia:</b> <xsl:value-of select="BIBLIO"/></p>
                    <p><b>Autor:</b> <xsl:value-of select="AUTOR"/></p>
                    <p><b>Data:</b> <xsl:value-of select="DATA"/></p>
                    
                    <address>
                        <!--Quero voltar à página principal -->
                        [<a href="index.html#/{count(preceding-sibling::*)+1}">Voltar à home</a>]
                    </address> 
                </body>
            </html>
        </xsl:result-document>
    </xsl:template>
    
    
  
   
    
</xsl:stylesheet>