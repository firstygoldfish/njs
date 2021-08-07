if [ -r data.lock ]
then
	echo "Someone else is updating the data."
	echo "If this persists for more than a few minutes"
	echo "contact your administrator (CL/KB)."
	exit 1
fi
date > data.lock
cp iomdata.json iomdata.json.bak
echo "1] Create an IOM offender"
echo "2] Creatre a NON-IOM offender"
echo "Anything else to quit"
AFIN=""
echo -e "Enter choice : \c";read AFIN
if [ "$AFIN" = "1" ]
then
	#Create IOM Offender
	echo -e "Enter CRN : \c";read CRN
	echo -e "Enter OFFENDER_ID : \c";read OFFID
	if [ "$CRN" = "" ] | [ "$OFFID" = "" ]
	then
		echo "Invalid data input."
		rm data.lock
		exit 1
	fi
	cat newiomcrndata.json | sed "s/<CRNNUMBER>/$CRN/" | sed "s/<OFFENDERID>/$OFFID/" > iomdata.json.new
	cat iomdata.json.new >> iomdata.json
	rm iomdata.json.new
	rm data.lock
	exit 0
fi
if [ "$AFIN" = "2" ]
then
	#Create NONIOM Offender
else
	echo "Invalid request"
	exit 1
fi
rm data.lock
